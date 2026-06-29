import styles from './ReviewPagination.module.css';

export default function ReviewPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <i className="ti ti-chevron-left" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        <i className="ti ti-chevron-right" />
      </button>
    </div>
  );
}
