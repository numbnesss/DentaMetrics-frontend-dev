import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import { doctorWorksIn } from '../../../data/clinic';
import styles from './AddReviewModal.module.css';

function doctorShortName(doctor) {
  const parts = [
    doctor.last_name,
    doctor.first_name ? `${doctor.first_name[0]}.` : '',
    doctor.patronymic ? `${doctor.patronymic[0]}.` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

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

export default function AddReviewModal({ branches, sources, doctors, defaultBranchId = '', onClose, onCreated }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    branch_id: defaultBranchId,
    source_id: sources.length === 1 ? sources[0].id : '',
  }));
  const [doctorIds, setDoctorIds] = useState(() => new Set());
  const [showOtherDoctors, setShowOtherDoctors] = useState(false);
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

  const { ownDoctors, otherDoctors } = useMemo(() => {
    if (!branch) return { ownDoctors: [], otherDoctors: doctors };
    return {
      ownDoctors: doctors.filter((d) => doctorWorksIn(d, branch.name)),
      otherDoctors: doctors.filter((d) => !doctorWorksIn(d, branch.name)),
    };
  }, [doctors, branch]);

  const changeBranch = (branchId) => {
    setField('branch_id', branchId);
    setDoctorIds(new Set());
    setShowOtherDoctors(false);
  };

  const toggleDoctor = (id) => {
    setDoctorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
      external_id: null,
      doctors_ref: doctors
        .filter((d) => doctorIds.has(d.id))
        .map((d) => ({ id: d.id, name: doctorShortName(d) })),
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

  const renderDoctor = (d) => {
    const checked = doctorIds.has(d.id);
    return (
      <button
        key={d.id}
        type="button"
        className={`${styles.doctorOption} ${checked ? styles.checked : ''}`}
        onClick={() => toggleDoctor(d.id)}
        disabled={saving}
      >
        <span className={styles.checkbox}>{checked && <i className="ti ti-check" />}</span>
        {doctorShortName(d)}
      </button>
    );
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

          <div className={styles.field}>
            <span className={styles.label}>Врачи</span>
            {!branch ? (
              <span className={styles.hint}>Сначала выберите филиал</span>
            ) : (
              <div className={styles.doctorList}>
                {ownDoctors.length === 0 && <span className={styles.hint}>В этом филиале нет врачей</span>}
                {ownDoctors.map(renderDoctor)}
                {otherDoctors.length > 0 && !showOtherDoctors && (
                  <button type="button" className={styles.moreBtn} onClick={() => setShowOtherDoctors(true)}>
                    Показать врачей других филиалов ({otherDoctors.length})
                  </button>
                )}
                {showOtherDoctors && (
                  <>
                    <span className={styles.groupLabel}>Другие филиалы</span>
                    {otherDoctors.map(renderDoctor)}
                  </>
                )}
              </div>
            )}
          </div>

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
          {saving ? 'Сохранение...' : 'Добавить отзыв'}
        </button>
      </form>
    </div>
  );
}
