import DeltaIndicator from '../../ui/DeltaIndicator/DeltaIndicator';
import styles from './KpiCard.module.css';

export default function KpiCard({ icon, label, value, delta }) {
  return (
    <div className={styles.card}>
      <i className={`ti ${icon} ${styles.icon}`} aria-hidden="true" />
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {delta && <DeltaIndicator direction={delta.direction} text={delta.text} />}
    </div>
  );
}
