import styles from './ReviewPagination.module.css';

function buildPages(page, totalPages) {
  const pages = [];
  const push = (p) => pages.push(p);

  push(1);

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) push('...');
  for (let p = start; p <= end; p += 1) push(p);
  if (end < totalPages - 1) push('...');

  if (totalPages > 1) push(totalPages);

  return pages;
}

export default function ReviewPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <i className="ti ti-chevron-left" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`gap-${i}`} className={styles.gap}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}

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
