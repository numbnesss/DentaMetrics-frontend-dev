import StarDistribution from '../StarDistribution/StarDistribution';
import { trendFor } from '../../../data/clinic';
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

export default function BranchCard({ branch, period, isOpen, onClick }) {
  const trend = trendFor(branch, period);
  return (
    <div className={`${styles.card} ${isOpen ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.name}>{branch.name}</span>
        <span className={`${styles.badge} ${getRatingClass(branch.rating)}`}>
          {getRatingLabel(branch.rating)}
        </span>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingValue}>{branch.rating.toFixed(1)}</span>
        <div className={styles.ratingMeta}>
          <span className={styles.reviewCount}>{branch.reviewCount} отзывов</span>
          <span className={`${styles.trend} ${trend.dir === 'up' ? styles.trendUp : styles.trendDown}`}>
            <i className={`ti ti-arrow-${trend.dir}`} />
            {trend.text} за период
          </span>
        </div>
      </div>

      <StarDistribution stars={branch.stars} />

      <div className={styles.miniCards}>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Позитивные</span>
          <span className={`${styles.miniValue} ${styles.positive}`}>{branch.positive}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Нейтральные</span>
          <span className={`${styles.miniValue} ${styles.neutral}`}>{branch.neutral}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Негативные</span>
          <span className={`${styles.miniValue} ${styles.negative}`}>{branch.negative}%</span>
        </div>
      </div>

      <button className={styles.detailsBtn}>
        {isOpen ? 'Скрыть детали' : 'Подробная статистика'}
        <i className={`ti ti-chevron-down ${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>
    </div>
  );
}
