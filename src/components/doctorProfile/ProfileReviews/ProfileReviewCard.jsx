import ToneBadge from '../../reviewPage/ui/ToneBadge/ToneBadge';
import SourceBadge from '../../reviewPage/ui/SourceBadge/SourceBadge';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { avatarStyle } from '../../../data/clinic';
import styles from './ProfileReviewCard.module.css';

export default function ProfileReviewCard({ review }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} style={avatarStyle(review.avatarColor)}>
          {review.initials}
        </div>
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{review.name}</span>
            <StarRating value={review.rating} size={12} />
          </div>
          <div className={styles.subRow}>
            <SourceBadge source={review.source} />
            <span className={styles.date}>{review.date}</span>
          </div>
        </div>
      </div>

      <p className={styles.text}>{review.text}</p>

      <div className={styles.footer}>
        <ToneBadge tone={review.tone} />
        <a
          className={styles.link}
          href={review.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Перейти к отзыву
          <i className="ti ti-external-link" />
        </a>
      </div>
    </div>
  );
}
