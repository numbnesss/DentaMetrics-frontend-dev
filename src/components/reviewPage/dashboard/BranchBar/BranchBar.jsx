import styles from './BranchBar.module.css';

function getColor(rating) {
  if (rating >= 4.0) return '#1D9E75';
  if (rating >= 3.5) return '#378ADD';
  return '#EF9F27';
}
export default function BranchBar({ name, rating }) {
  const pct = (rating / 5) * 100;
  return (
    <div className={styles.row}>
      <div className={styles.name} title={name}>{name}</div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct.toFixed(1)}%`, background: getColor(rating) }}
        />
      </div>
      <div className={styles.value}>{rating.toFixed(1)}</div>
    </div>
  );
}
