import { useNavigate } from 'react-router-dom';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { avatarStyle, doctorAvatarColor } from '../../../data/clinic';
import styles from './DoctorCard.module.css';

function doctorName(doctor) {
  return [doctor.last_name, doctor.first_name, doctor.patronymic].filter(Boolean).join(' ');
}

function doctorInitials(doctor) {
  return `${doctor.last_name?.[0] ?? ''}${doctor.first_name?.[0] ?? ''}`.toUpperCase();
}

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const rating = doctor.avg_rate ?? 0;

  return (
    <div className={styles.card} onClick={() => navigate(`/doctors/${doctor.id}`)}>
      <div className={styles.header}>
        <div className={styles.avatar} style={avatarStyle(doctorAvatarColor(doctor.id))}>
          {doctorInitials(doctor)}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{doctorName(doctor)}</div>
          <div className={styles.branch}>
            <i className="ti ti-building-hospital" />
            {doctor.branch_name || 'Филиал не указан'}
          </div>
        </div>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        <div className={styles.ratingMeta}>
          <StarRating value={Math.round(rating)} size={13} />
          <span className={styles.reviewCount}>{doctor.review_count ?? 0} отзывов</span>
        </div>
      </div>

      <div className={styles.miniCards}>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Позитивные</span>
          <span className={`${styles.miniValue} ${styles.positive}`}>{doctor.positive_pct ?? 0}%</span>
        </div>
        <div className={styles.miniCard}>
          <span className={styles.miniLabel}>Негативные</span>
          <span className={`${styles.miniValue} ${styles.negative}`}>{doctor.negative_pct ?? 0}%</span>
        </div>
      </div>
    </div>
  );
}
