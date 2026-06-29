import styles from './StarDistribution.module.css';

function getColor(star) {
  if (star >= 4) return '#1D9E75';
  if (star === 3) return '#EF9F27';
  return '#E24B4A';
}

export default function StarDistribution({ stars, showNumbers = false }) {
  const total = Object.values(stars).reduce((a, b) => a + b, 0);
  return (
    <div className={styles.wrap}>
      {[5, 4, 3, 2, 1].map((star) => {
        const pct = total > 0 ? (stars[star] / total) * 100 : 0;
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
              ? <span className={styles.count}>{stars[star]}</span>
              : <span className={styles.pct}>{pct.toFixed(0)}%</span>
            }
          </div>
        );
      })}
    </div>
  );
}
