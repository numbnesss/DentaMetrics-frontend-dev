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

export default function AssignModal({ review, doctors, branchName, onClose, onAssigned, onUnassigned }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { ownDoctors, otherDoctors } = useMemo(() => {
    const own = doctors.filter((d) => d.branch_name === branchName);
    const others = doctors.filter((d) => d.branch_name !== branchName);
    return { ownDoctors: own, otherDoctors: others };
  }, [doctors, branchName]);

  const handleSelect = async (doctor) => {
    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/api/v1/reviews/${review.id}/doctor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: doctor.id, review_id: review.id }),
      });
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        onAssigned(review.id, doctor.id, doctorShortName(doctor));
        onClose();
      } else {
        setError('Не удалось привязать отзыв к врачу');
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось привязать отзыв к врачу');
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
        onUnassigned(review.id);
        onClose();
      } else {
        setError('Не удалось отвязать отзыв от врача');
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось отвязать отзыв от врача');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Привязать отзыв к врачу</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>

        <p className={styles.reviewText}>{review.review_text}</p>

        {review.doctor_id && (
          <button
            className={styles.unassignBtn}
            onClick={handleUnassign}
            disabled={saving}
          >
            <i className="ti ti-unlink" />
            Отвязать от врача «{review.doctor_name}»
          </button>
        )}

        <div className={styles.list}>
          {ownDoctors.length === 0 && otherDoctors.length === 0 && (
            <div className={styles.empty}>Нет доступных врачей</div>
          )}

          {ownDoctors.length > 0 && (
            <>
              <div className={styles.groupLabel}>Врачи этого филиала</div>
              {ownDoctors.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.doctorOption} ${d.id === review.doctor_id ? styles.current : ''}`}
                  onClick={() => handleSelect(d)}
                  disabled={saving}
                >
                  <i className="ti ti-stethoscope" />
                  <span className={styles.doctorName}>{doctorShortName(d)}</span>
                </button>
              ))}
            </>
          )}

          {otherDoctors.length > 0 && (
            <>
              <div className={styles.groupLabel}>Врачи других филиалов</div>
              {otherDoctors.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.doctorOption} ${d.id === review.doctor_id ? styles.current : ''}`}
                  onClick={() => handleSelect(d)}
                  disabled={saving}
                >
                  <i className="ti ti-stethoscope" />
                  <span className={styles.doctorName}>{doctorShortName(d)}</span>
                  <span className={styles.doctorBranch}>{d.branch_name || 'Филиал не указан'}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
