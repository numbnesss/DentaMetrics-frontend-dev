import { useState, useMemo } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import styles from './AssignModal.module.css';

function doctorShortName(doctor) {
  const parts = [
    doctor.last_name,
    doctor.first_name ? `${doctor.first_name[0]}.` : '',
    doctor.patronymic ? `${doctor.patronymic[0]}.` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

export default function AssignModal({ review, doctors, branchName, onClose, onSaved, onUnassigned }) {
  const initialIds = useMemo(() => new Set((review.doctor_id ?? []).map((d) => d.id)), [review.doctor_id]);
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialIds));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { ownDoctors, otherDoctors } = useMemo(() => {
    const own = doctors.filter((d) => d.branch_name === branchName);
    const others = doctors.filter((d) => d.branch_name !== branchName);
    return { ownDoctors: own, otherDoctors: others };
  }, [doctors, branchName]);

  const toggleDoctor = (doctorId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(doctorId)) next.delete(doctorId);
      else next.add(doctorId);
      return next;
    });
  };

  const handleSave = async () => {
    const finalIds = Array.from(selectedIds);
    const unchanged =
      initialIds.size === selectedIds.size && Array.from(initialIds).every((id) => selectedIds.has(id));

    if (unchanged) {
      onClose();
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (initialIds.size > 0) {
        const delResponse = await apiFetch(`/api/v1/reviews/${review.id}/doctor`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ review_id: review.id }),
        });
        const delData = await delResponse.json();
        if (!delResponse.ok || delData.result !== 'success') {
          setError('Не удалось сохранить привязку');
          setSaving(false);
          return;
        }
      }

      for (const doctorId of finalIds) {
        const response = await apiFetch(`/api/v1/reviews/${review.id}/doctor`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctor_id: doctorId, review_id: review.id }),
        });
        const data = await response.json();
        if (!response.ok || data.result !== 'success') {
          setError('Не удалось сохранить привязку полностью');
          setSaving(false);
          return;
        }
      }

      const assignedRefs = finalIds
        .map((id) => doctors.find((d) => d.id === id))
        .filter(Boolean)
        .map((d) => ({ id: d.id, name: doctorShortName(d) }));
      onSaved(review.id, assignedRefs);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить привязку');
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/api/v1/reviews/${review.id}/doctor`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: review.id }),
      });
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setSelectedIds(new Set());
        onUnassigned(review.id);
        onClose();
      } else {
        setError('Не удалось отвязать врачей');
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось отвязать врачей');
    } finally {
      setSaving(false);
    }
  };

  const hasAssigned = (review.doctor_id ?? []).length > 0;

  const renderDoctorRow = (d, showBranch) => {
    const checked = selectedIds.has(d.id);
    return (
      <button
        key={d.id}
        type="button"
        className={`${styles.doctorOption} ${checked ? styles.checked : ''}`}
        onClick={() => toggleDoctor(d.id)}
        disabled={saving}
      >
        <span className={styles.checkbox}>
          {checked && <i className="ti ti-check" />}
        </span>
        <i className="ti ti-stethoscope" />
        <span className={styles.doctorName}>{doctorShortName(d)}</span>
        {showBranch && <span className={styles.doctorBranch}>{d.branch_name || 'Филиал не указан'}</span>}
      </button>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Привязать отзыв к врачам</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>

        <p className={styles.reviewText}>{review.review_text}</p>

        {hasAssigned && (
          <button className={styles.unassignBtn} onClick={handleUnassign} disabled={saving}>
            <i className="ti ti-unlink" />
            Отвязать всех врачей
          </button>
        )}

        <div className={styles.list}>
          {ownDoctors.length === 0 && otherDoctors.length === 0 && (
            <div className={styles.empty}>Нет доступных врачей</div>
          )}

          {ownDoctors.length > 0 && (
            <>
              <div className={styles.groupLabel}>Врачи этого филиала</div>
              {ownDoctors.map((d) => renderDoctorRow(d, false))}
            </>
          )}

          {otherDoctors.length > 0 && (
            <>
              <div className={styles.groupLabel}>Врачи других филиалов</div>
              {otherDoctors.map((d) => renderDoctorRow(d, true))}
            </>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
