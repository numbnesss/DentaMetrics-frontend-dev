import { useState } from 'react';
import { doctorsByBranch, doctors as ALL_DOCTORS } from '../../../data/clinic';
import styles from './AssignModal.module.css';

export default function AssignModal({ review, branchName, onCancel, onConfirm }) {
  const [docId, setDocId] = useState('');

  const sameBranch = doctorsByBranch(branchName);
  const sameIds = new Set(sameBranch.map((d) => d.id));
  const others = ALL_DOCTORS.filter((d) => !sameIds.has(d.id));

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <i className="ti ti-link" style={{ color: 'var(--teal)' }} />
          Привязать к врачу
        </div>

        <div className={styles.reviewText}>«{review.text}»</div>

        <div className={styles.label}>Выберите врача</div>
        <select className={styles.select} value={docId} onChange={(e) => setDocId(e.target.value)}>
          <option value="">— Выберите врача —</option>
          {sameBranch.length > 0 && (
            <optgroup label="Врачи этого филиала">
              {sameBranch.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </optgroup>
          )}
          {others.length > 0 && (
            <optgroup label="Другие врачи">
              {others.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.branch})</option>
              ))}
            </optgroup>
          )}
        </select>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>Отмена</button>
          <button
            className={styles.confirm}
            disabled={!docId}
            onClick={() => onConfirm(ALL_DOCTORS.find((d) => String(d.id) === String(docId)))}
          >
            Привязать
          </button>
        </div>
      </div>
    </div>
  );
}
