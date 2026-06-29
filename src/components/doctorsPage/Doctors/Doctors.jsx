import { useState, useMemo, useCallback } from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';
import DoctorsFilters from '../DoctorsFilters/DoctorsFilters';
import { doctors } from '../../../data/clinic';
import { usePeriod } from '../../../context/PeriodContext';
import styles from './Doctors.module.css';

const SORT_FN = {
  rating_desc:  (a, b) => b.rating - a.rating,
  rating_asc:   (a, b) => a.rating - b.rating,
  reviews_desc: (a, b) => b.reviewCount - a.reviewCount,
  reviews_asc:  (a, b) => a.reviewCount - b.reviewCount,
};

export default function Doctors() {
  const { period } = usePeriod();
  const [search, setSearch]   = useState('');
  const [branch, setBranch]   = useState('Все филиалы');
  const [sort, setSort]       = useState('rating_desc');

  const filtered = useMemo(() => {
    let list = [...doctors];
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (branch !== 'Все филиалы') list = list.filter((d) => d.branch === branch);
    return list.sort(SORT_FN[sort]);
  }, [search, branch, sort]);

  const handleSearch = useCallback((q) => setSearch(q), []);
  const handleBranch = useCallback((b) => setBranch(b), []);
  const handleSort   = useCallback((s) => setSort(s), []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="ti ti-stethoscope" />
          Врачи
        </h1>
        <span className={styles.pageCount}>{filtered.length} врачей</span>
      </div>

      <DoctorsFilters
        onSearch={handleSearch}
        onBranch={handleBranch}
        onSort={handleSort}
      />

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} period={period} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <i className="ti ti-search-off" />
          <span>Врачи не найдены</span>
        </div>
      )}
    </div>
  );
}
