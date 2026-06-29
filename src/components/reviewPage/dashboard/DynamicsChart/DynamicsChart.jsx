import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './DynamicsChart.module.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipMonth}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipLabel}>{entry.name}</span>
          <span className={styles.tooltipValue}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className={styles.legend}>
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.legendItem}>
          <div
            className={styles.legendLine}
            style={{
              borderTop: `2px ${entry.dataKey === 'negative' ? 'dashed' : 'solid'} ${entry.color}`,
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DynamicsChart({ data }) {
  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="var(--b1)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--t3)' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--b2)', strokeWidth: 1 }} />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="positive" name="Позитивные" stroke="#1D9E75" strokeWidth={2}
            dot={{ r: 4, fill: '#1D9E75', stroke: 'var(--bg)', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#1D9E75', stroke: 'var(--bg)', strokeWidth: 2 }}
          />
          <Line type="monotone" dataKey="negative" name="Негативные" stroke="#E24B4A" strokeWidth={2} strokeDasharray="4 3"
            dot={{ r: 4, fill: '#E24B4A', stroke: 'var(--bg)', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#E24B4A', stroke: 'var(--bg)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div >
  );
}
