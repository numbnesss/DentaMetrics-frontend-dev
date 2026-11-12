import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import styles from './AddReviewModal.module.css';

function todayInput() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Сегодня — текущее время, другой день — полдень по местному времени.
function toIsoDate(dateValue) {
  if (dateValue === todayInput()) return new Date().toISOString();
  return new Date(`${dateValue}T12:00:00`).toISOString();
}

// Бэк хранит отзывы уникальными по паре (external_id, source_id): без своего external_id
// все ручные отзывы одного источника перезаписывали бы друг друга.
function manualExternalId() {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `manual-${random}`;
}

const EMPTY_FORM = {
  branch_id: '',
  source_id: '',
  author_name: '',
  rate: 5,
  review_date: todayInput(),
  review_text: '',
  review_link: '',
  has_response: false,
  response_text: '',
};

export default function AddReviewModal({ branches, sources, defaultBranchId = '', onClose, onCreated }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    branch_id: defaultBranchId,
    source_id: sources.length === 1 ? sources[0].id : '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [saving, onClose]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const branch = branches.find((b) => b.id === form.branch_id);

  const changeBranch = (branchId) => setField('branch_id', branchId);

  const canSave =
    form.branch_id &&
    form.source_id &&
    form.review_date &&
    form.review_text.trim() &&
    !(form.has_response && !form.response_text.trim()) &&
    !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    const source = sources.find((s) => s.id === form.source_id);
    const body = {
      branch_id: form.branch_id,
      branch_name: branch?.name ?? '',
      external_id: manualExternalId(),
      source_id: form.source_id,
      source_name: source?.code ?? '',
      rate: form.rate,
      author_name: form.author_name.trim() || 'Аноним',
      review_text: form.review_text.trim(),
      review_date: toIsoDate(form.review_date),
      review_link: form.review_link.trim(),
      has_response: form.has_response,
      response_text: form.has_response ? form.response_text.trim() : null,
    };

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.result === 'success') {
        onCreated();
        onClose();
        return;
      }
      if (response.status === 403) setError('Недостаточно прав для добавления отзыва');
      else if (response.status === 400) setError(data.message || 'Проверьте заполненные поля');
      else setError('Не удалось добавить отзыв');
    } catch (err) {
      console.error(err);
      setError('Не удалось подключиться к серверу');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !saving && onClose()}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <span className={styles.title}>Новый отзыв</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} disabled={saving} aria-label="Закрыть">
            <i className="ti ti-x" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Филиал *</span>
              <select
                className={styles.input}
                value={form.branch_id}
                onChange={(e) => changeBranch(e.target.value)}
                disabled={saving}
              >
                <option value="" disabled>Выберите филиал</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Источник *</span>
              <select
                className={styles.input}
                value={form.source_id}
                onChange={(e) => setField('source_id', e.target.value)}
                disabled={saving}
              >
                <option value="" disabled>Выберите источник</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Автор</span>
              <input
                className={styles.input}
                value={form.author_name}
                onChange={(e) => setField('author_name', e.target.value)}
                placeholder="Аноним"
                disabled={saving}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Дата отзыва *</span>
              <input
                type="date"
                className={styles.input}
                value={form.review_date}
                max={todayInput()}
                onChange={(e) => setField('review_date', e.target.value)}
                disabled={saving}
              />
            </label>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Оценка *</span>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.star} ${n <= form.rate ? styles.starOn : ''}`}
                  onClick={() => setField('rate', n)}
                  disabled={saving}
                  aria-label={`${n} из 5`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Текст отзыва *</span>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={4}
              value={form.review_text}
              onChange={(e) => setField('review_text', e.target.value)}
              disabled={saving}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Ссылка на отзыв</span>
            <input
              className={styles.input}
              value={form.review_link}
              onChange={(e) => setField('review_link', e.target.value)}
              placeholder="https://..."
              disabled={saving}
            />
          </label>

          <label className={styles.check}>
            <input
              type="checkbox"
              checked={form.has_response}
              onChange={(e) => setField('has_response', e.target.checked)}
              disabled={saving}
            />
            Есть ответ клиники
          </label>

          {form.has_response && (
            <label className={styles.field}>
              <span className={styles.label}>Ответ клиники *</span>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                value={form.response_text}
                onChange={(e) => setField('response_text', e.target.value)}
                disabled={saving}
              />
            </label>
          )}
        </div>

        <div className={styles.hint}>
          Врача можно привязать после добавления — кнопкой «Врачу» на карточке отзыва.
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.saveBtn} disabled={!canSave}>
          {saving ? 'Сохранение...' : 'Добавить отзыв'}
        </button>
      </form>
    </div>
  );
}
