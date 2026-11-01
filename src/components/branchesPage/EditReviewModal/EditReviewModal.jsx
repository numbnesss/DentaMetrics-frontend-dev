import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import styles from './EditReviewModal.module.css';

function toDateInput(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Меняем только день, время отзыва оставляем прежним.
function withDate(iso, dateValue) {
  const [y, m, d] = dateValue.split('-').map(Number);
  const date = Number.isNaN(new Date(iso).getTime()) ? new Date() : new Date(iso);
  date.setFullYear(y, m - 1, d);
  return date.toISOString();
}

export default function EditReviewModal({ review, branches, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    rate: review.rate ?? 5,
    review_text: review.review_text ?? '',
    review_date: toDateInput(review.review_date),
    branch_id: review.branch_id ?? '',
    has_response: Boolean(review.has_response),
    response_text: review.response_text ?? '',
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

  const buildChanges = () => {
    const changes = {};
    if (form.rate !== review.rate) changes.rate = form.rate;
    if (form.review_text.trim() !== (review.review_text ?? '')) changes.review_text = form.review_text.trim();
    if (form.review_date && form.review_date !== toDateInput(review.review_date)) {
      changes.review_date = withDate(review.review_date, form.review_date);
    }
    if (form.branch_id && form.branch_id !== review.branch_id) changes.branch_id = form.branch_id;
    if (form.has_response !== Boolean(review.has_response)) changes.has_response = form.has_response;
    const responseText = form.has_response ? form.response_text.trim() : '';
    if (responseText !== (review.response_text ?? '')) changes.response_text = responseText;
    return changes;
  };

  const canSave = form.review_date && !(form.has_response && !form.response_text.trim()) && !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    const changes = buildChanges();
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/api/v1/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.result === 'success') {
        const updated = { ...review, ...changes };
        if (changes.branch_id) {
          updated.branch_name = branches.find((b) => b.id === changes.branch_id)?.name ?? review.branch_name;
        }
        onSaved(updated, review);
        onClose();
        return;
      }
      if (response.status === 403) setError('Недостаточно прав для изменения отзыва');
      else if (response.status === 400) setError(data.message || 'Проверьте заполненные поля');
      else setError('Не удалось сохранить отзыв');
    } catch (err) {
      console.error(err);
      setError('Не удалось подключиться к серверу');
    } finally {
      setSaving(false);
    }
  };

  const branchKnown = branches.some((b) => b.id === form.branch_id);

  return (
    <div className={styles.overlay} onClick={() => !saving && onClose()}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <span className={styles.title}>Редактирование отзыва</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} disabled={saving} aria-label="Закрыть">
            <i className="ti ti-x" />
          </button>
        </div>

        <div className={styles.author}>
          {review.author_name || 'Аноним'}
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Оценка</span>
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
              <span className={styles.label}>Дата отзыва</span>
              <input
                type="date"
                className={styles.input}
                value={form.review_date}
                onChange={(e) => setField('review_date', e.target.value)}
                disabled={saving}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Филиал</span>
            <select
              className={styles.input}
              value={form.branch_id}
              onChange={(e) => setField('branch_id', e.target.value)}
              disabled={saving}
            >
              {!branchKnown && <option value={form.branch_id}>{review.branch_name || 'Не указан'}</option>}
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Текст отзыва</span>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={4}
              value={form.review_text}
              onChange={(e) => setField('review_text', e.target.value)}
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

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.saveBtn} disabled={!canSave}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
