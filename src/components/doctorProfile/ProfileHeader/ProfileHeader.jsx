import { useNavigate } from 'react-router-dom';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { trendFor, avatarStyle } from '../../../data/clinic';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader({ doctor, period }) {
  const navigate = useNavigate();
  const trend = trendFor(doctor, period);

  return (
    <div className={styles.wrap}>
      <button className={styles.backBtn} onClick={() => navigate('/doctors')}>
        <i className="ti ti-arrow-left" />
        Назад к врачам
      </button>

      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.identityBlock}>
            <div className={styles.avatar} style={avatarStyle(doctor.avatarColor)}>
              {doctor.initials}
            </div>
            <div className={styles.identity}>
              <div className={styles.name}>{doctor.name}</div>
              <div className={styles.branch}>
                <i className="ti ti-building-hospital" />
                {doctor.branch}
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.ratingBlock}>
            <span className={styles.ratingValue}>{doctor.rating.toFixed(1)}</span>
            <div className={styles.ratingMeta}>
              <StarRating value={Math.round(doctor.rating)} size={14} />
              <span className={styles.reviewCount}>{doctor.reviewCount} отзывов за всё время</span>
              <span className={`${styles.trend} ${trend.dir === 'up' ? styles.up : styles.down}`}>
                <i className={`ti ti-arrow-${trend.dir}`} />
                {trend.text} за период
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={`${styles.metricValue} ${styles.positive}`}>{doctor.positive}%</span>
              <span className={styles.metricLabel}>Позитивные</span>
            </div>
            <div className={styles.metric}>
              <span className={`${styles.metricValue} ${styles.neutral}`}>{doctor.neutral}%</span>
              <span className={styles.metricLabel}>Нейтральные</span>
            </div>
            <div className={styles.metric}>
              <span className={`${styles.metricValue} ${styles.negative}`}>{doctor.negative}%</span>
              <span className={styles.metricLabel}>Негативные</span>
            </div>
          </div>
        </div>

        <div className={styles.sourceRatings}>
          <div className={styles.sourceTitle}>
            <i className="ti ti-star" />
            Рейтинг по сайтам
          </div>
          <div className={styles.sourceList}>
            {doctor.sourceRatings.map((s) => (
              <div className={styles.sourceRow} key={s.name}>
                <span className={styles.sourceName}>{s.name}</span>
                <div className={styles.sourceBar}>
                  <div
                    className={styles.sourceFill}
                    style={{ width: `${(s.value / 5) * 100}%`, background: s.color }}
                  />
                </div>
                <span className={styles.sourceValue}>{s.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
