import styles from './DeltaIndicator.module.css';

export default function DeltaIndicator({ direction, text }) {
  const isUp = direction === 'up';
  return (
    <div className={`${styles.delta} ${isUp ? styles.up : styles.down}`}>
      <i className={`ti ti-arrow-${isUp ? 'up' : 'down'} ${styles.icon}`} aria-hidden="true" />
      {text}
    </div>
  );
}
