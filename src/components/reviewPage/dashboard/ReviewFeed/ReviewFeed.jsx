import ReviewItem from '../ReviewItem/ReviewItem';
import styles from './ReviewFeed.module.css';

export default function ReviewFeed({ title, icon, todayCount, reviews }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>
          {icon && <i className={`ti ${icon} ${styles.titleIcon}`} aria-hidden="true" />}
          {title}
        </span>
        <span className={styles.todayBadge}>+{todayCount} за сегодня</span>
      </div>
      {reviews.map((review, idx) => (
        <ReviewItem key={idx} {...review} />
      ))}
    </div>
  );
}
