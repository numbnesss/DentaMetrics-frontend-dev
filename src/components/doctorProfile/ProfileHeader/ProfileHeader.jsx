import { useNavigate } from 'react-router-dom';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { avatarStyle, doctorAvatarColor, doctorBranchesLabel, deltaInfo, DELTA_ICON } from '../../../data/clinic';
import styles from './ProfileHeader.module.css';

function doctorName(doctor) {
  return [doctor.last_name, doctor.first_name, doctor.patronymic].filter(Boolean).join(' ');
}

function doctorInitials(doctor) {
  return `${doctor.last_name?.[0] ?? ''}${doctor.first_name?.[0] ?? ''}`.toUpperCase();
}

function formatDelta(key, value) {
  const info = deltaInfo(value, key === 'rating' ? 2 : 0);
  if (!info) return null;
  const label = key === 'rating' ? 'рейтинг' : 'отзывов';
  return { direction: info.direction, text: `${label} ${info.text} за период` };
}

export default function ProfileHeader({ doctor, trend, status, canArchive, archiving, onToggleArchive }) {
  const navigate = useNavigate();
  const rating = doctor.avg_rate ?? 0;
  const ratingDelta = formatDelta('rating', trend?.avg_doctor_rating);
  const reviewsDelta = formatDelta('reviews', trend?.total_reviews);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={() => navigate('/doctors')}>
          <i className="ti ti-arrow-left" />
          Назад к врачам
        </button>
        {canArchive && (
          <button className={styles.archiveBtn} onClick={onToggleArchive} disabled={archiving}>
            <i className={`ti ${status === 'archived' ? 'ti-archive-off' : 'ti-archive'}`} />
            {status === 'archived' ? 'Вернуть из архива' : 'В архив'}
          </button>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.identityBlock}>
            <div className={styles.avatar} style={avatarStyle(doctorAvatarColor(doctor.id))}>
              {doctorInitials(doctor)}
            </div>
            <div className={styles.identity}>
              <div className={styles.name}>
                {doctorName(doctor)}
                {status === 'archived' && <span className={styles.archivedBadge}>Архив</span>}
              </div>
              <div className={styles.branch}>
                <i className="ti ti-building-hospital" />
                {doctorBranchesLabel(doctor)}
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.ratingBlock}>
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            <div className={styles.ratingMeta}>
              <StarRating value={Math.round(rating)} size={14} />
              <span className={styles.reviewCount}>{doctor.review_count ?? 0} отзывов за всё время</span>
              {ratingDelta && (
                <span className={`${styles.trend} ${styles[ratingDelta.direction]}`}>
                  <i className={`ti ${DELTA_ICON[ratingDelta.direction]}`} />
                  {ratingDelta.text}
                </span>
              )}
              {reviewsDelta && (
                <span className={`${styles.trend} ${styles[reviewsDelta.direction]}`}>
                  <i className={`ti ${DELTA_ICON[reviewsDelta.direction]}`} />
                  {reviewsDelta.text}
                </span>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={`${styles.metricValue} ${styles.positive}`}>{doctor.positive_pct ?? 0}%</span>
              <span className={styles.metricLabel}>Позитивные</span>
            </div>
            <div className={styles.metric}>
              <span className={`${styles.metricValue} ${styles.negative}`}>{doctor.negative_pct ?? 0}%</span>
              <span className={styles.metricLabel}>Негативные</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
