import styles from './ReviewFilters.module.css';

function doctorShortName(doctor) {
  const parts = [
    doctor.last_name,
    doctor.first_name ? `${doctor.first_name[0]}.` : '',
    doctor.patronymic ? `${doctor.patronymic[0]}.` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

export default function ReviewFilters({ filters, onChange, sources, doctors }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.sentiment}
          onChange={(e) => onChange({ ...filters, sentiment: e.target.value })}
        >
          <option value="all">Все отзывы</option>
          <option value="positive">Позитивные</option>
          <option value="negative">Негативные</option>
        </select>

        <select
          className={styles.select}
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
        >
          <option value="all">Все источники</option>
          {sources.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.doctor}
          onChange={(e) => onChange({ ...filters, doctor: e.target.value })}
        >
          <option value="all">Все врачи</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{doctorShortName(d)}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.order}
          onChange={(e) => onChange({ ...filters, order: e.target.value })}
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
      </div>
    </div>
  );
}
