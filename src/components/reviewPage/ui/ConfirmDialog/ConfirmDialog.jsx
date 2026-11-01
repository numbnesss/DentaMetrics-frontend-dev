import { useEffect } from 'react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ title, text, confirmLabel, busy, error, danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [busy, onCancel]);

  return (
    <div className={styles.overlay} onClick={() => !busy && onCancel()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        {text && <p className={styles.text}>{text}</p>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={busy}>
            Отмена
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${danger ? styles.danger : ''}`}
            onClick={onConfirm}
            disabled={busy}
            autoFocus
          >
            {busy ? 'Подождите...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
