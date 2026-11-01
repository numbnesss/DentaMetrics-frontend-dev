import { useEffect, useMemo, useState, useCallback } from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';
import DoctorsFilters from '../DoctorsFilters/DoctorsFilters';
import AddDoctorModal from '../AddDoctorModal/AddDoctorModal';
import { useAuth } from '../../../context/AuthContext';
import { usePeriod } from '../../../context/PeriodContext';
import { apiFetch } from '../../../api/apiFetch';
import { doctorBranches, doctorWorksIn } from '../../../data/clinic';
import styles from './Doctors.module.css';

const SORT_FN = {
  rating_desc:  (a, b) => (b.avg_rate ?? 0) - (a.avg_rate ?? 0),
  rating_asc:   (a, b) => (a.avg_rate ?? 0) - (b.avg_rate ?? 0),
  reviews_desc: (a, b) => (b.review_count ?? 0) - (a.review_count ?? 0),
  reviews_asc:  (a, b) => (a.review_count ?? 0) - (b.review_count ?? 0),
};

export default function Doctors() {
  const { periodDays, periodQuery, isAllTime } = usePeriod();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch]   = useState('');
  const [branch, setBranch]   = useState('Все филиалы');
  const [sort, setSort]       = useState('rating_desc');
  const [addOpen, setAddOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchDoctors();
  }, [periodDays, isAllTime]);

  const fetchDoctors = async () => {
    try {
      const url = `/api/v1/doctors?${periodQuery}`;
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
    () => ['Все филиалы', ...Array.from(new Set(doctors.flatMap(doctorBranches)))],
    [doctors],
  );

  const filtered = useMemo(() => {
    let list = [...doctors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => `${d.last_name} ${d.first_name} ${d.patronymic ?? ''}`.toLowerCase().includes(q));
    }
    if (branch !== 'Все филиалы') list = list.filter((d) => doctorWorksIn(d, branch));
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
        {isAdmin && (
          <button type="button" className={styles.addBtn} onClick={() => setAddOpen(true)}>
            <i className="ti ti-plus" />
            Добавить врача
          </button>
        )}
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

      {addOpen && <AddDoctorModal onClose={() => setAddOpen(false)} onCreated={fetchDoctors} />}
    </div>
  );
}
