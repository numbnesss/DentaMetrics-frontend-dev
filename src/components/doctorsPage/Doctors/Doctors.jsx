import { useEffect, useMemo, useState, useCallback } from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';
import DoctorsFilters from '../DoctorsFilters/DoctorsFilters';
import { usePeriod } from '../../../context/PeriodContext';
import { apiFetch } from '../../../api/apiFetch';
import styles from './Doctors.module.css';

const SORT_FN = {
  rating_desc:  (a, b) => (b.avg_rate ?? 0) - (a.avg_rate ?? 0),
  rating_asc:   (a, b) => (a.avg_rate ?? 0) - (b.avg_rate ?? 0),
  reviews_desc: (a, b) => (b.review_count ?? 0) - (a.review_count ?? 0),
  reviews_asc:  (a, b) => (a.review_count ?? 0) - (b.review_count ?? 0),
};

export default function Doctors() {
  const { periodDays, isAllTime } = usePeriod();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch]   = useState('');
  const [branch, setBranch]   = useState('Все филиалы');
  const [sort, setSort]       = useState('rating_desc');

  useEffect(() => {
    fetchDoctors();
  }, [periodDays, isAllTime]);

  const fetchDoctors = async () => {
    try {
      const url = isAllTime ? '/api/v1/doctors/alltime' : `/api/v1/doctors?period_days=${periodDays}`;
      const response = await apiFetch(url);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const branches = useMemo(
    () => ['Все филиалы', ...Array.from(new Set(doctors.map((d) => d.branch_name).filter(Boolean)))],
    [doctors],
  );

  const filtered = useMemo(() => {
    let list = [...doctors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => `${d.last_name} ${d.first_name} ${d.patronymic ?? ''}`.toLowerCase().includes(q));
    }
    if (branch !== 'Все филиалы') list = list.filter((d) => d.branch_name === branch);
    return list.sort(SORT_FN[sort]);
  }, [doctors, search, branch, sort]);

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
        branches={branches}
      />

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
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
