import styles from './ToneBadge.module.css';

const CONFIG = {
  positive: { className: styles.positive, label: 'Позитивный' },
  neutral:  { className: styles.neutral,  label: 'Нейтральный' },
  negative: { className: styles.negative, label: 'Негативный' },
};

export default function ToneBadge({ tone }) {
  const cfg = CONFIG[tone] ?? CONFIG.positive;
  return (
    <span className={`${styles.badge} ${cfg.className}`}>{cfg.label}</span>
  );
}
