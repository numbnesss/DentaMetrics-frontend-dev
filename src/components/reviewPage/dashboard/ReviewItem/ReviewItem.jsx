import StarRating from '../../ui/StarRating/StarRating';
import ToneBadge from '../../ui/ToneBadge/ToneBadge';
import SourceBadge from '../../ui/SourceBadge/SourceBadge';
import styles from './ReviewItem.module.css';

export default function ReviewItem({ name, rating, source, text, tone }) {
  return (
    <div className={styles.item}>
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        <StarRating value={rating} />
      </div>
      <div className={styles.badges}>
        <SourceBadge source={source} />
        <ToneBadge tone={tone} />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
