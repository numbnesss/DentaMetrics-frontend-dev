import SourceRatingCard from '../SourceRatingCard/SourceRatingCard';
import styles from './SourceRatings.module.css';

function lastMonthLabel() {
  const now = new Date();
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return firstOfLastMonth.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatUpdatedAt(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('ru-RU');
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

export default function SourceRatings({ sources, updatedAt }) {
  if (!sources || sources.length === 0) return null;

  const snapshotLabel = lastMonthLabel();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>
          <i className="ti ti-world" />
          Рейтинг по сайтам
        </span>
        {updatedAt && (
          <span className={styles.updated}>
            <i className="ti ti-clock" />
            Обновлено: {formatUpdatedAt(updatedAt)}
          </span>
        )}
      </div>

      <div className={styles.grid}>
        {sources.map((s) => (
          <SourceRatingCard key={s.source_code} source={s} snapshotLabel={snapshotLabel} />
        ))}
      </div>
    </div>
  );
}
