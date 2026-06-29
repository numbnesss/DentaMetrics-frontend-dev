import { useNavigate } from 'react-router-dom';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { trendFor, avatarStyle } from '../../../data/clinic';
import styles from './DoctorCard.module.css';

export default function DoctorCard({ doctor, period }) {
  const navigate = useNavigate();
  const trend = trendFor(doctor, period);

  return (
    <div className={styles.card} onClick={() => navigate(`/doctors/${doctor.id}`)}>
      <div className={styles.header}>
        <div className={styles.avatar} style={avatarStyle(doctor.avatarColor)}>
          {doctor.initials}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{doctor.name}</div>
          <div className={styles.branch}>
            <i className="ti ti-building-hospital" />
            {doctor.branch}
          </div>
        </div>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingValue}>{doctor.rating.toFixed(1)}</span>
        <div className={styles.ratingMeta}>
          <StarRating value={Math.round(doctor.rating)} size={13} />
          <span className={styles.reviewCount}>{doctor.reviewCount} отзывов</span>
        </div>
      </div>

      <div className={styles.miniCards}>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Позитивные</span>
          <span className={`${styles.miniValue} ${styles.positive}`}>{doctor.positive}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Нейтральные</span>
          <span className={`${styles.miniValue} ${styles.neutral}`}>{doctor.neutral}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Негативные</span>
          <span className={`${styles.miniValue} ${styles.negative}`}>{doctor.negative}%</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.trendLabel}>Тренд за период</span>
        <span className={`${styles.trend} ${trend.dir === 'up' ? styles.trendUp : styles.trendDown}`}>
          <i className={`ti ti-arrow-${trend.dir}`} />
          {trend.text}
        </span>
      </div>
    </div>
  );
}
