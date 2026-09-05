import StarDistribution from '../StarDistribution/StarDistribution';
import styles from './BranchCard.module.css';

function getRatingClass(rating) {
  if (rating >= 4.0) return styles.badgeGreen;
  if (rating >= 3.5) return styles.badgeBlue;
  return styles.badgeAmber;
}

function getRatingLabel(rating) {
  if (rating >= 4.0) return 'Высокий';
  if (rating >= 3.5) return 'Средний';
  return 'Низкий';
}

function formatDelta(value) {
  if (value === undefined || value === null) return null;
  const isUp = value >= 0;
  const sign = isUp ? '+' : '';
  return { isUp, text: `${sign}${value} за период` };
}

export default function BranchCard({ branch, isOpen, onClick }) {
  const rating = branch.rating ?? 0;
  const delta = formatDelta(branch.trend?.total_reviews);

  return (
    <div className={`${styles.card} ${isOpen ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.name}>{branch.name}</span>
        <span className={`${styles.badge} ${getRatingClass(rating)}`}>
          {getRatingLabel(rating)}
        </span>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        <div className={styles.ratingMeta}>
          <span className={styles.reviewCount}>{branch.total_reviews ?? 0} отзывов</span>
          {delta && (
            <span className={`${styles.trend} ${delta.isUp ? styles.trendUp : styles.trendDown}`}>
              <i className={`ti ti-arrow-${delta.isUp ? 'up' : 'down'}`} />
              {delta.text}
            </span>
          )}
        </div>
      </div>

      <StarDistribution stars={branch.stars ?? {}} />

      <div className={styles.miniCards}>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Позитивные</span>
          <span className={`${styles.miniValue} ${styles.positive}`}>{branch.positive_pct ?? 0}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Негативные</span>
          <span className={`${styles.miniValue} ${styles.negative}`}>{branch.negative_pct ?? 0}%</span>
        </div>
      </div>

      <button className={styles.detailsBtn}>
        {isOpen ? 'Скрыть детали' : 'Подробная статистика'}
        <i className={`ti ti-chevron-down ${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>
    </div>
  );
}
