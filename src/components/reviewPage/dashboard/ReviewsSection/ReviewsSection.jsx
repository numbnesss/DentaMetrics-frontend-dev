import ReviewFeed from '../ReviewFeed/ReviewFeed';
import styles from './ReviewsSection.module.css';

export default function ReviewsSection({ branchFeed, doctorFeed }) {
  return (
    <div className={styles.section}>
      <ReviewFeed {...branchFeed} />
      <ReviewFeed {...doctorFeed} />
    </div>
  );
}
