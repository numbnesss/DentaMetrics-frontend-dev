import styles from './BranchMetrics.module.css';

const METRICS = [
  { key: 'rating',   deltaKey: 'avg_branch_rating', label: 'Рейтинг',      sub: 'За период',    icon: 'ti-star' },
  { key: 'reviews',  deltaKey: 'total_reviews',      label: 'Отзывов',      sub: 'За всё время', icon: 'ti-messages' },
  { key: 'positive', deltaKey: 'positive_pct',       label: '% позитивных', sub: 'Позитивные',   icon: 'ti-mood-happy' },
  { key: 'negative', deltaKey: 'negative_pct',       label: '% негативных', sub: 'Негативные',   icon: 'ti-mood-sad' },
];

function formatDelta(key, value) {
  if (value === undefined || value === null) return null;
  const isUp = value >= 0;
  const sign = isUp ? '+' : '';
  if (key === 'rating') return { isUp, text: `${sign}${value.toFixed(2)}` };
  if (key === 'reviews') return { isUp, text: `${sign}${value}` };
  return { isUp, text: `${sign}${value.toFixed(1)}%` };
}

export default function BranchMetrics({ branch, trend }) {
  const values = {
    rating:   (branch.rating ?? 0).toFixed(1),
    reviews:  branch.total_reviews ?? 0,
    positive: `${branch.positive_pct ?? 0}%`,
    negative: `${branch.negative_pct ?? 0}%`,
  };

  return (
    <div className={styles.grid}>
      {METRICS.map((m) => {
        const delta = formatDelta(m.key, trend?.[m.deltaKey]);
        return (
          <div key={m.key} className={styles.cell}>
            <div className={styles.cellHeader}>
              <i className={`ti ${m.icon} ${styles.icon}`} />
              <span className={styles.sub}>{m.sub}</span>
            </div>
            <div className={styles.value}>{values[m.key]}</div>
            <div className={styles.label}>{m.label}</div>
            {delta && (
              <div className={`${styles.trend} ${delta.isUp ? styles.up : styles.down}`}>
                <i className={`ti ti-arrow-${delta.isUp ? 'up' : 'down'}`} />
                {delta.text} за период
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
