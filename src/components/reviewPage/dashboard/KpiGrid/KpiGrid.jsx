import KpiCard from '../KpiCard/KpiCard';
import styles from './KpiGrid.module.css';

export default function KpiGrid({ items }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}
