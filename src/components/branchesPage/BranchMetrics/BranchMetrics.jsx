import { trendFor, reviewTrendFor } from '../../../data/clinic';
import styles from './BranchMetrics.module.css';

const METRICS = [
  { key: 'rating',   label: 'Рейтинг',         sub: 'За период',      icon: 'ti-star',         hasTrend: true },
  { key: 'reviews',  label: 'Отзывов',          sub: 'За всё время',   icon: 'ti-messages',     hasTrend: true },
  { key: 'positive', label: '% позитивных',     sub: 'О клинике',      icon: 'ti-mood-happy',   hasTrend: false },
  { key: 'negative', label: '% негативных',     sub: 'О клинике',      icon: 'ti-mood-sad',     hasTrend: false },
];

export default function BranchMetrics({ branch, period }) {
  const ratingTrend = trendFor(branch, period);
  const reviewsTrend = reviewTrendFor(branch, period);
  const values = {
    rating:   { value: branch.rating.toFixed(1), trend: ratingTrend.text,  dir: ratingTrend.dir },
    reviews:  { value: branch.reviewCount,        trend: reviewsTrend.text, dir: reviewsTrend.dir },
    positive: { value: `${branch.positive}%`,     trend: null,              dir: null },
    negative: { value: `${branch.negative}%`,     trend: null,              dir: null },
  };

  return (
    <div className={styles.grid}>
      {METRICS.map((m) => {
        const v = values[m.key];
        return (
          <div key={m.key} className={styles.cell}>
            <div className={styles.cellHeader}>
              <i className={`ti ${m.icon} ${styles.icon}`} />
              <span className={styles.sub}>{m.sub}</span>
            </div>
            <div className={styles.value}>{v.value}</div>
            <div className={styles.label}>{m.label}</div>
            {v.trend && (
              <div className={`${styles.trend} ${v.dir === 'up' ? styles.up : styles.down}`}>
                <i className={`ti ti-arrow-${v.dir}`} />
                {v.trend}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
