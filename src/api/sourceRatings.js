import { apiFetch } from './apiFetch';

// Блок «Рейтинг по сайтам» на «Обзоре».
// Текущая цифра — опубликованный рейтинг площадки (published): последний снимок
// по каждому филиалу из /branches/:id/source-rates, по клинике — среднее по филиалам.
// Сравнение — среднее опубликованных снимков за прошлый месяц (/overview/avgrate, origin=published).
// Количество отзывов считается как раньше, по нашей базе (origin=computed).

async function getData(url) {
  const response = await apiFetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.result !== 'success') throw new Error(`${url}: ${response.status}`);
  return data.data ?? [];
}

function isoDay(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function previousMonthRange(now = new Date()) {
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 1); // date_to в avgrate не включается
  return { from: isoDay(from), to: isoDay(to), month: from };
}

function average(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  if (nums.length === 0) return null;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 100) / 100;
}

function groupBySource(rows, pick) {
  const map = new Map();
  rows.forEach((row) => {
    if (!row?.source_id) return;
    if (!map.has(row.source_id)) map.set(row.source_id, []);
    map.get(row.source_id).push(pick(row));
  });
  return map;
}

export async function loadSourceRatings(sources = []) {
  const prev = previousMonthRange();

  const branches = await getData('/api/v1/branches?period_days=alltime');

  const [published, prevPublished, computed] = await Promise.all([
    Promise.all(
      branches.map((b) =>
        getData(`/api/v1/branches/${b.id}/source-rates`).catch((err) => {
          console.error(err);
          return [];
        }),
      ),
    ).then((lists) => lists.flat()),
    getData(`/api/v1/overview/avgrate?origin=published&date_from=${prev.from}&date_to=${prev.to}`).catch((err) => {
      console.error(err);
      return [];
    }),
    getData('/api/v1/overview/avgrate?origin=computed').catch((err) => {
      console.error(err);
      return [];
    }),
  ]);

  const current = groupBySource(published, (r) => r.current_rating);
  const previous = groupBySource(prevPublished, (r) => r.avg_rate);
  const counts = groupBySource(computed, (r) => r.measurements_count);
  const names = new Map(published.map((r) => [r.source_id, r.source_name]));

  const order = sources.length > 0 ? sources.map((s) => s.id) : [...current.keys()];
  const rows = order
    .filter((id) => current.has(id))
    .map((id) => {
      const source = sources.find((s) => s.id === id);
      const count = (counts.get(id) ?? []).reduce((s, n) => s + (Number(n) || 0), 0);
      return {
        source_id: id,
        source_name: source?.name ?? names.get(id) ?? 'Источник',
        color_hex: source?.color_hex,
        current_rating: average(current.get(id)),
        prev_rating: average(previous.get(id) ?? []),
        review_count: counts.has(id) ? count : null,
      };
    });

  const times = published.map((r) => new Date(r.collected_at).getTime()).filter(Number.isFinite);
  const updatedAt = times.length > 0 ? new Date(Math.max(...times)).toISOString() : null;

  return { rows, updatedAt, prevMonth: prev.month };
}
