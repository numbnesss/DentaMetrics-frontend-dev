import SourceRatingCard from '../SourceRatingCard/SourceRatingCard';
import styles from './SourceRatings.module.css';

// подпись строки сравнения: средний опубликованный рейтинг за прошлый месяц
function monthLabel(date) {
  const d = date ?? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const name = d.toLocaleDateString('ru-RU', { month: 'long' });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatUpdatedAt(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('ru-RU');
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

export default function SourceRatings({ sources, updatedAt, prevMonth }) {
  if (!sources || sources.length === 0) return null;

  const snapshotLabel = monthLabel(prevMonth);

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
          <SourceRatingCard key={s.source_id ?? s.source_name} source={s} snapshotLabel={snapshotLabel} />
        ))}
      </div>
    </div>
  );
}
