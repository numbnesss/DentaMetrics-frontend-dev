import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import styles from './AddDoctorModal.module.css';

function splitList(value) {
  return Array.from(new Set(value.split(',').map((s) => s.trim()).filter(Boolean)));
}

export default function AddDoctorModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ last_name: '', first_name: '', patronymic: '', specialities: '', aliases: '' });
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(() => new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/v1/branches?period_days=alltime')
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!cancelled && response.ok && data.result === 'success') setBranches(data.data ?? []);
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [saving, onClose]);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleBranch = (id) => {
    setSelectedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canSave = form.last_name.trim() && form.first_name.trim() && !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    const body = {
      last_name: form.last_name.trim(),
      first_name: form.first_name.trim(),
      specialities: splitList(form.specialities),
      aliases: splitList(form.aliases),
      branches: branches.filter((b) => selectedBranches.has(b.id)).map((b) => ({ id: b.id, name: b.name })),
    };
    if (form.patronymic.trim()) body.patronymic = form.patronymic.trim();

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch('/api/v1/doctors', {
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
      setError(response.status === 403 ? 'Недостаточно прав для добавления врача' : 'Не удалось добавить врача');
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
          <span className={styles.title}>Новый врач</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} disabled={saving} aria-label="Закрыть">
            <i className="ti ti-x" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Фамилия *</span>
              <input className={styles.input} value={form.last_name} onChange={setField('last_name')} autoFocus />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Имя *</span>
              <input className={styles.input} value={form.first_name} onChange={setField('first_name')} />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Отчество</span>
            <input className={styles.input} value={form.patronymic} onChange={setField('patronymic')} />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Специализации</span>
            <input
              className={styles.input}
              value={form.specialities}
              onChange={setField('specialities')}
              placeholder="Терапевт, ортопед"
            />
            <span className={styles.hint}>Через запятую</span>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Как врача называют в отзывах</span>
            <input
              className={styles.input}
              value={form.aliases}
              onChange={setField('aliases')}
              placeholder="Иван Иванов, Иванов И.И."
            />
            <span className={styles.hint}>Через запятую. По этим вариантам отзывы привязываются к врачу автоматически</span>
          </label>

          <div className={styles.field}>
            <span className={styles.label}>Филиалы</span>
            {branches.length === 0 ? (
              <span className={styles.hint}>Загрузка филиалов...</span>
            ) : (
              <div className={styles.branchList}>
                {branches.map((b) => {
                  const checked = selectedBranches.has(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={`${styles.branchOption} ${checked ? styles.checked : ''}`}
                      onClick={() => toggleBranch(b.id)}
                      disabled={saving}
                    >
                      <span className={styles.checkbox}>{checked && <i className="ti ti-check" />}</span>
                      {b.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.saveBtn} disabled={!canSave}>
          {saving ? 'Сохранение...' : 'Добавить врача'}
        </button>
      </form>
    </div>
  );
}
