import StarRating from '../../ui/StarRating/StarRating';
import styles from './SourceRatingCard.module.css';

const ARROW_ICON = { up: 'ti-arrow-up', down: 'ti-arrow-down', flat: 'ti-arrow-right' };

function trendArrow(current, prev) {
  if (current === null || current === undefined || prev === null || prev === undefined) return null;
  if (current > prev) return 'up';
  if (current < prev) return 'down';
  return 'flat';
}

export default function SourceRatingCard({ source, snapshotLabel }) {
  const hasData = source.current_rating !== null && source.current_rating !== undefined;
  const hasPrev = source.prev_rating !== null && source.prev_rating !== undefined;
  const scale = source.scale ?? 5;
  const starValue = hasData ? (scale === 10 ? source.current_rating / 2 : source.current_rating) : 0;
  const arrow = hasPrev ? trendArrow(source.current_rating, source.prev_rating) : null;

  return (
    <div className={styles.card} style={{ borderTopColor: source.color_hex }}>
      <div className={styles.name}>{source.source_name}</div>

      <div className={styles.rating}>
        {hasData ? source.current_rating.toFixed(1) : '—'}
        {hasData && scale === 10 && <span className={styles.scaleSuffix}>/10</span>}
      </div>

      <StarRating value={hasData ? Math.round(starValue) : 0} size={12} color={hasData ? source.color_hex : undefined} />

      <div className={styles.count}>{hasData ? `${source.review_count} отзывов` : 'Нет отзывов'}</div>

      <div className={styles.divider} />

      <div className={styles.prevRow}>
        <span className={styles.prevLabel}>{snapshotLabel}</span>
        {hasPrev ? (
          <>
            <span className={styles.prevValue}>
              {scale === 10 ? `${source.prev_rating.toFixed(1)}/10` : source.prev_rating.toFixed(1)}
            </span>
            {arrow && (
              <span className={`${styles.arrow} ${styles[arrow]}`}>
                <i className={`ti ${ARROW_ICON[arrow]}`} />
              </span>
            )}
          </>
        ) : (
          <span className={styles.prevValue}>—</span>
        )}
      </div>
    </div>
  );
}
