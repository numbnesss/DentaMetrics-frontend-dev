import styles from './StarDistribution.module.css';

function getColor(star) {
  if (star >= 4) return '#1D9E75';
  if (star === 3) return '#EF9F27';
  return '#E24B4A';
}

export default function StarDistribution({ stars, showNumbers = false }) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, ...(stars ?? {}) };
  const total = [5, 4, 3, 2, 1].reduce((sum, star) => sum + (Number(counts[star]) || 0), 0);

  return (
    <div className={styles.wrap}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = Number(counts[star]) || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className={styles.row}>
            <span className={styles.label}>{star}★</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${pct.toFixed(1)}%`, background: getColor(star) }}
              />
            </div>
            {showNumbers
              ? <span className={styles.count}>{count}</span>
              : <span className={styles.pct}>{pct.toFixed(0)}%</span>
            }
          </div>
        );
      })}
    </div>
  );
}
