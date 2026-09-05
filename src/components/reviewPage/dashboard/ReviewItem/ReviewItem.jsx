import StarRating from '../../ui/StarRating/StarRating';
import ToneBadge from '../../ui/ToneBadge/ToneBadge';
import SourceBadge from '../../ui/SourceBadge/SourceBadge';
import styles from './ReviewItem.module.css';

function getTone(rate) {
  return rate >= 4 ? 'positive' : 'negative';
}

export default function ReviewItem({ review, source }) {
  return (
    <div className={styles.item}>
      <div className={styles.meta}>
        <span className={styles.name}>{review.author_name || 'Аноним'}</span>
        <StarRating value={review.rate} />
      </div>
      <div className={styles.badges}>
        <SourceBadge source={source?.name || 'Источник'} color={source?.color_hex} />
        <ToneBadge tone={getTone(review.rate)} />
      </div>
      <div className={styles.text}>{review.review_text}</div>
    </div>
  );
}
