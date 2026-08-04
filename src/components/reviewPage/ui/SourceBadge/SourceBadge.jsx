import styles from './SourceBadge.module.css';

const SOURCE_COLORS = {
  'Google':      '#378ADD',
  'Яндекс':      '#EF9F27',
  '2ГИС':        '#1D9E75',
  'ПроДокторов': '#9F77DD',
};

export default function SourceBadge({ source, color }) {
  const dotColor = color || SOURCE_COLORS[source] || '#888';
  return (
    <span className={styles.badge}>
      <span className={styles.dot} style={{ background: dotColor }} />
      {source}
    </span>
  );
}
