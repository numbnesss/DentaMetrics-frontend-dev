import styles from './StarRating.module.css';

export default function StarRating({ value, size = 13, color }) {
  return (
    <span
      className={styles.stars}
      style={{ fontSize: size, ...(color ? { color } : {}) }}
      aria-label={`${value} из 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`${styles.star} ${i < value ? styles.filled : ''}`}>★</span>
      ))}
    </span>
  );
}
