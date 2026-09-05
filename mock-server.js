import express from 'express';

const app = express();
app.use(express.json());

const PORT = 8080;

const SOURCES = [
  { id: 's1', code: '2gis', name: '2ГИС', color_hex: '#19AA20' },
  { id: 's2', code: 'prodoctorov', name: 'ПроДокторов', color_hex: '#2563EB' },
];

const BRANCH_NAMES = ['Центральный филиал', 'Филиал на Ленина', 'Западный филиал', 'Северный филиал'];
const FIRST = ['Иван', 'Пётр', 'Анна', 'Мария', 'Сергей', 'Елена', 'Дмитрий', 'Ольга'];
const LAST = ['Иванов', 'Петров', 'Сидорова', 'Кузнецова', 'Смирнов', 'Попова', 'Фёдоров', 'Морозова'];
const PATR = ['Иванович', 'Петрович', 'Сергеевна', 'Дмитриевна', 'Олегович', 'Андреевна'];
const AUTHORS = ['Пациент', 'Аноним', 'Иван К.', 'Мария П.', 'Гость', 'Ольга С.', 'Дмитрий', 'Елена В.'];
const TEXTS = [
  'Отличная клиника, всё понравилось!',
  'Врач внимательный, всё объяснил подробно.',
  'Долго ждал приёма, но лечением доволен.',
  'Не очень понравилось отношение персонала.',
  'Спасибо за профессионализм и заботу!',
  'Дорого, но качество на высоте.',
  'Записался легко, приняли вовремя.',
  'Были проблемы, но их быстро решили.',
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid(prefix, n) { return `${prefix}-${n}`; }

function doctorShortName(d) {
  const parts = [d.last_name, d.first_name ? `${d.first_name[0]}.` : '', d.patronymic ? `${d.patronymic[0]}.` : ''];
  return parts.filter(Boolean).join(' ');
}

function makeStars(total) {
  const s = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (let i = 0; i < total; i += 1) {
    const r = Math.random();
    const star = r < 0.55 ? 5 : r < 0.78 ? 4 : r < 0.88 ? 3 : r < 0.95 ? 2 : 1;
    s[star] += 1;
  }
  return s;
}

function pctFromStars(stars, total) {
  if (total === 0) return { positive: 0, negative: 0 };
  const pos = stars[5] + stars[4];
  const neg = stars[2] + stars[1];
  return {
    positive: Math.round((pos / total) * 1000) / 10,
    negative: Math.round((neg / total) * 1000) / 10,
  };
}

function sourceBreakdown() {
  const a = rndInt(30, 70);
  return [
    { source_id: 's1', source_name: '2ГИС', pct: a },
    { source_id: 's2', source_name: 'ПроДокторов', pct: 100 - a },
  ];
}

// --- Generate stable dataset ---
const BRANCHES = BRANCH_NAMES.map((name, i) => {
  const total = rndInt(80, 600);
  const stars = makeStars(total);
  const { positive, negative } = pctFromStars(stars, total);
  const ratingSum = stars[1] * 1 + stars[2] * 2 + stars[3] * 3 + stars[4] * 4 + stars[5] * 5;
  return {
    id: uuid('branch', i + 1),
    name,
    rating: Math.round((ratingSum / total) * 100) / 100,
    total_reviews: total,
    positive_pct: positive,
    negative_pct: negative,
    stars,
    source_breakdown: sourceBreakdown(),
  };
});

const DOCTORS = Array.from({ length: 18 }, (_, i) => {
  const total = rndInt(20, 200);
  const stars = makeStars(total);
  const { positive, negative } = pctFromStars(stars, total);
  const ratingSum = stars[1] * 1 + stars[2] * 2 + stars[3] * 3 + stars[4] * 4 + stars[5] * 5;
  return {
    id: uuid('doctor', i + 1),
    first_name: rnd(FIRST),
    last_name: rnd(LAST),
    patronymic: rnd(PATR),
    specialities: [rnd(['Терапевт', 'Ортопед', 'Хирург', 'Ортодонт'])],
    aliases: [],
    branch_name: rnd(BRANCH_NAMES),
    avg_rate: Math.round((ratingSum / total) * 100) / 100,
    review_count: total,
    positive_pct: positive,
    negative_pct: negative,
    stars,
    source_breakdown: sourceBreakdown(),
  };
});

// review store: keyed by branch and doctor
function pickDoctors() {
  const r = Math.random();
  if (r < 0.35) return [];
  if (r < 0.75) return [rnd(DOCTORS)];
  const a = rnd(DOCTORS);
  let b = rnd(DOCTORS);
  while (b.id === a.id) b = rnd(DOCTORS);
  return [a, b];
}

function makeReviews(count, branchName, forDoctor) {
  return Array.from({ length: count }, (_, i) => {
    const rate = (() => {
      const r = Math.random();
      return r < 0.55 ? 5 : r < 0.78 ? 4 : r < 0.88 ? 3 : r < 0.95 ? 2 : 1;
    })();
    const source = rnd(SOURCES);
    const hasResp = Math.random() < 0.4;
    const assignedDoctors = forDoctor ? [forDoctor] : pickDoctors();
    const daysAgo = rndInt(0, 340);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      id: `${forDoctor ? 'dr' : 'br'}-${branchName}-${i}`,
      branch_id: 'branch-1',
      branch_name: branchName,
      doctor_ids: assignedDoctors.map((d) => d.id),
      doctor_names: assignedDoctors.map(doctorShortName),
      source_id: source.id,
      source_name: source.code,
      rate,
      author_name: rnd(AUTHORS),
      review_text: rnd(TEXTS),
      review_date: date.toISOString(),
      review_link: Math.random() < 0.8 ? 'https://2gis.ru/example' : '',
      has_response: hasResp,
      response_text: hasResp ? 'Спасибо за ваш отзыв! Будем рады видеть вас снова.' : '',
    };
  });
}

const BRANCH_REVIEWS = {};
BRANCHES.forEach((b) => { BRANCH_REVIEWS[b.id] = makeReviews(rndInt(30, 120), b.name, null); });
const DOCTOR_REVIEWS = {};
DOCTORS.forEach((d) => { DOCTOR_REVIEWS[d.id] = makeReviews(rndInt(10, 60), d.branch_name, d); });

// --- Helpers for trend ---
function trendBlock() {
  const cur = {
    total_reviews: rndInt(80, 200),
    avg_branch_rating: 4 + Math.random(),
    avg_doctor_rating: 4 + Math.random(),
    positive_pct: rndInt(70, 90),
    negative_pct: rndInt(5, 20),
  };
  const prev = {
    total_reviews: cur.total_reviews - rndInt(-30, 30),
    avg_branch_rating: cur.avg_branch_rating - (Math.random() - 0.5) * 0.4,
    avg_doctor_rating: cur.avg_doctor_rating - (Math.random() - 0.5) * 0.4,
    positive_pct: cur.positive_pct - rndInt(-8, 8),
    negative_pct: cur.negative_pct - rndInt(-5, 5),
  };
  const round2 = (n) => Math.round(n * 100) / 100;
  const round1 = (n) => Math.round(n * 10) / 10;
  const delta = {
    total_reviews: cur.total_reviews - prev.total_reviews,
    avg_branch_rating: round2(cur.avg_branch_rating - prev.avg_branch_rating),
    avg_doctor_rating: round2(cur.avg_doctor_rating - prev.avg_doctor_rating),
    positive_pct: round1(cur.positive_pct - prev.positive_pct),
    negative_pct: round1(cur.negative_pct - prev.negative_pct),
  };
  return {
    current: { ...cur, avg_branch_rating: round2(cur.avg_branch_rating), avg_doctor_rating: round2(cur.avg_doctor_rating) },
    previous: { ...prev, avg_branch_rating: round2(prev.avg_branch_rating), avg_doctor_rating: round2(prev.avg_doctor_rating) },
    delta,
  };
}

function paginate(list, page, pageSize = 7) {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, parseInt(page, 10) || 1), totalPages);
  const reviews = list.slice((p - 1) * pageSize, p * pageSize);
  return { reviews, page: p, total_pages: totalPages, total };
}

function applyFilters(list, query) {
  let out = [...list];
  if (query.sentiment === 'positive') out = out.filter((r) => r.rate >= 4);
  if (query.sentiment === 'negative') out = out.filter((r) => r.rate <= 2);
  if (query.source) out = out.filter((r) => {
    const src = SOURCES.find((s) => s.id === r.source_id);
    return src && src.code === query.source;
  });
  if (query.doctor_id) out = out.filter((r) => r.doctor_ids.includes(query.doctor_id));
  out.sort((a, b) => {
    const da = new Date(a.review_date);
    const db = new Date(b.review_date);
    return query.order === 'oldest' ? da - db : db - da;
  });
  return out;
}

// --- AUTH ---
app.post('/auth/login', (req, res) => res.json({ result: 'success' }));
app.get('/auth/logout', (req, res) => res.json({ result: 'success' }));
app.get('/api/v1/getMe', (req, res) =>
  res.json({ result: 'success', user: { id: 'u1', login: 'admin', role: 'admin' } }),
);

// --- SOURCES ---
app.get('/api/v1/sources', (req, res) => res.json({ result: 'success', data: SOURCES }));

// --- RATINGS BY SOURCE (Обзор — блок «Рейтинг по сайтам») ---
const RATING_SOURCES = [
  { code: 'google',       name: 'Google',        color: '#FBBC05', scale: 5 },
  { code: 'yandex',       name: 'Яндекс Карты',  color: '#F8604A', scale: 5 },
  { code: '2gis',         name: '2ГИС',          color: '#1D9E75', scale: 5 },
  { code: 'prodoctorov',  name: 'ПроДокторов',   color: '#9F77DD', scale: 5 },
  { code: '32top',        name: '32топ',         color: '#57B0FF', scale: 5 },
  { code: 'napopravku',   name: 'НаПоправку',    color: '#2196F3', scale: 5 },
  { code: 'zoon',         name: 'Zoon',          color: '#FF4D00', scale: 5, noData: true },
  { code: 'doctu',        name: 'ДокТу',         color: '#4CAF50', scale: 5, noSnapshot: true },
  { code: 'sberzdorovie', name: 'Сберздоровье',  color: '#21A038', scale: 10 },
];

function buildSourceRatings() {
  const sources = RATING_SOURCES.map((s) => {
    if (s.noData) {
      return {
        source_code: s.code,
        source_name: s.name,
        color_hex: s.color,
        scale: s.scale,
        current_rating: null,
        review_count: 0,
        prev_rating: null,
      };
    }
    const max = s.scale === 10 ? 10 : 5;
    const current = Math.round((max * 0.8 + Math.random() * max * 0.18) * 10) / 10;
    const prev = s.noSnapshot ? null : Math.round((current - (Math.random() - 0.5) * (max * 0.08)) * 10) / 10;
    return {
      source_code: s.code,
      source_name: s.name,
      color_hex: s.color,
      scale: s.scale,
      current_rating: current,
      review_count: rndInt(20, 450),
      prev_rating: prev,
    };
  });
  return { updated_at: new Date().toISOString(), sources };
}

app.get('/api/v1/overview/ratings-by-source', (req, res) =>
  res.json({ result: 'success', data: buildSourceRatings() }),
);

// --- OVERVIEW ---
function buildOverview() {
  const allReviews = Object.values(BRANCH_REVIEWS).flat();
  const latest = [...allReviews].sort((a, b) => new Date(b.review_date) - new Date(a.review_date)).slice(0, 7);
  const totalReviews = BRANCHES.reduce((s, b) => s + b.total_reviews, 0);
  const avgBranch = BRANCHES.reduce((s, b) => s + b.rating, 0) / BRANCHES.length;
  const avgDoctor = DOCTORS.reduce((s, d) => s + d.avg_rate, 0) / DOCTORS.length;
  return {
    result: 'success',
    overview: {
      total_reviews: totalReviews,
      avg_branch_rating: Math.round(avgBranch * 100) / 100,
      avg_doctor_rating: Math.round(avgDoctor * 100) / 100,
      positive_pct: 78.5,
      negative_pct: 12.1,
    },
    latest_reviews: latest,
    branches: BRANCHES,
  };
}

app.get('/api/v1/overview', (req, res) => res.json(buildOverview()));
app.get('/api/v1/overview/alltime', (req, res) => res.json(buildOverview()));

app.get('/api/v1/overview/chart', (req, res) => {
  const days = parseInt(req.query.period_days, 10) || 365;
  const overview = [];
  for (let i = days; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    overview.push({
      Period: d.toISOString(),
      PositiveCount: rndInt(1, 8),
      NegativeCount: rndInt(0, 2),
    });
  }
  res.json({ result: 'success', overview });
});

app.post('/api/v1/overview/trend', (req, res) => res.json({ result: 'success', data: trendBlock() }));
app.get('/api/v1/trend/branch/:id', (req, res) => res.json({ result: 'success', data: trendBlock() }));
app.get('/api/v1/trend/doctor/:id', (req, res) => res.json({ result: 'success', data: trendBlock() }));

// --- DOCTORS ---
app.get('/api/v1/doctors', (req, res) => res.json({ result: 'success', data: DOCTORS }));
app.get('/api/v1/doctors/alltime', (req, res) => res.json({ result: 'success', data: DOCTORS }));

app.get('/api/v1/doctors/:id/reviews', (req, res) => {
  const list = DOCTOR_REVIEWS[req.params.id] || [];
  const filtered = applyFilters(list, req.query);
  res.json({ result: 'success', data: paginate(filtered, req.query.page) });
});

// --- BRANCHES ---
app.get('/api/v1/branches', (req, res) => res.json({ result: 'success', data: BRANCHES }));
app.get('/api/v1/branches/alltime', (req, res) => res.json({ result: 'success', data: BRANCHES }));

app.get('/api/v1/branches/:id/reviews', (req, res) => {
  const list = BRANCH_REVIEWS[req.params.id] || [];
  const filtered = applyFilters(list, req.query);
  res.json({ result: 'success', data: paginate(filtered, req.query.page) });
});

// --- ASSIGN / UNASSIGN DOCTOR(S) ---
app.put('/api/v1/reviews/:id/doctors', (req, res) => {
  res.json({ result: 'success' });
});
app.delete('/api/v1/reviews/:id/doctor', (req, res) => {
  res.json({ result: 'success' });
});

app.listen(PORT, () => {
  console.log(`Mock backend running on http://127.0.0.1:${PORT}`);
});
