import styles from './SourceDistribution.module.css';

export default function SourceDistribution({ sources }) {

  const visible = sources.filter((s) => Number(s.pct) > 0);

  if (visible.length === 0) {
    return <div className={styles.empty}>Нет данных по источникам</div>;
  }

  return (
    <div className={styles.wrap}>
      {visible.map((s) => (
        <div key={s.name} className={styles.row}>
          <span className={styles.dot} style={{ background: s.color }} />
          <span className={styles.name}>{s.name}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${s.pct}%`, background: s.color }} />
          </div>
          <span className={styles.pct}>{s.pct}%</span>
        </div>
      ))}
    </div>
  );
}
