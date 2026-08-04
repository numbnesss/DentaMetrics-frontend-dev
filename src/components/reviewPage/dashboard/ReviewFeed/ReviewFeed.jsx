import ReviewItem from '../ReviewItem/ReviewItem';
import styles from './ReviewFeed.module.css';

export default function ReviewFeed({ title, icon, todayCount, reviews, sourceMap }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>
          {icon && <i className={`ti ${icon} ${styles.titleIcon}`} aria-hidden="true" />}
          {title}
        </span>
        {todayCount !== undefined && (
          <span className={styles.todayBadge}>+{todayCount} за сегодня</span>
        )}
      </div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewItem key={review.id} review={review} source={sourceMap.get(review.source_id)} />
        ))
      ) : (
        <div className={styles.empty}>
          <i className="ti ti-inbox" />
          Нет отзывов
        </div>
      )}
    </div>
  );
}
