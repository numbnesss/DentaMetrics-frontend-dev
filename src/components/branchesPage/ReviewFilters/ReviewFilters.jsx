import styles from './ReviewFilters.module.css';

export default function ReviewFilters({ filters, onChange, doctors, sources }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.tone}
          onChange={(e) => onChange({ ...filters, tone: e.target.value })}
        >
          <option value="all">Все отзывы</option>
          <option value="positive">Позитивные</option>
          <option value="neutral">Нейтральные</option>
          <option value="negative">Негативные</option>
        </select>

        <select
          className={styles.select}
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
        >
          <option value="all">Все источники</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.doctor}
          onChange={(e) => onChange({ ...filters, doctor: e.target.value })}
        >
          <option value="all">Все врачи</option>
          {doctors.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="date_desc">Сначала новые</option>
          <option value="date_asc">Сначала старые</option>
          <option value="rating_desc">Высокий рейтинг</option>
          <option value="rating_asc">Низкий рейтинг</option>
        </select>
      </div>
    </div>
  );
}
