import { useEffect, useState } from 'react';
import { DOCTOR_BRANCHES } from '../../../data/clinic';
import styles from './DoctorsFilters.module.css';

export default function DoctorsFilters({ onSearch, onBranch, onSort }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={styles.wrap}>
      <div className={styles.searchWrap}>
        <i className={`ti ti-search ${styles.searchIcon}`} />
        <input
          className={styles.input}
          type="text"
          placeholder="Поиск по ФИО..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.clear} onClick={() => setQuery('')}>
            <i className="ti ti-x" />
          </button>
        )}
      </div>

      <select
        className={styles.select}
        onChange={(e) => onBranch(e.target.value)}
        defaultValue="Все филиалы"
      >
        {DOCTOR_BRANCHES.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        className={styles.select}
        onChange={(e) => onSort(e.target.value)}
        defaultValue="rating_desc"
      >
        <option value="rating_desc">Рейтинг ↓</option>
        <option value="rating_asc">Рейтинг ↑</option>
        <option value="reviews_desc">Отзывов ↓</option>
        <option value="reviews_asc">Отзывов ↑</option>
      </select>
    </div>
  );
}
