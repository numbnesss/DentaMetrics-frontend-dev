import { useState, useMemo, useRef } from 'react';
import BranchMetrics from '../BranchMetrics/BranchMetrics';
import StarDistribution from '../StarDistribution/StarDistribution';
import SourceDistribution from '../SourceDistribution/SourceDistribution';
import ReviewFilters from '../ReviewFilters/ReviewFilters';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewPagination from '../ReviewPagination/ReviewPagination';
import AssignModal from '../AssignModal/AssignModal';
import { useAuth } from '../../../context/AuthContext';
import { doctorsByBranch, getDoctor } from '../../../data/clinic';
import styles from './BranchDetails.module.css';

const PAGE_SIZE = 7;
const SOURCE_ORDER = ['Google', 'Яндекс', '2ГИС', 'ПроДокторов'];

export default function BranchDetails({ branch, period, onClose }) {
  const { isAdmin } = useAuth();

  const [reviews, setReviews] = useState(branch.reviews);
  const [filters, setFilters] = useState({ tone: 'all', source: 'all', doctor: 'all', sort: 'date_desc' });
  const [page, setPage] = useState(1);
  const [assignTarget, setAssignTarget] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const pushedToProfile = useRef(new Set());

  const branchDoctorNames = doctorsByBranch(branch.name).map((d) => d.short);
  const availableSources = SOURCE_ORDER.filter((s) => reviews.some((r) => r.source === s));

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (filters.tone !== 'all') list = list.filter((r) => r.tone === filters.tone);
    if (filters.source !== 'all') list = list.filter((r) => r.source === filters.source);
    if (filters.doctor !== 'all') list = list.filter((r) => r.doctorName === filters.doctor);
    const sortMap = {
      date_desc:   (a, b) => b.id - a.id,
      date_asc:    (a, b) => a.id - b.id,
      rating_desc: (a, b) => b.rating - a.rating,
      rating_asc:  (a, b) => a.rating - b.rating,
    };
    return list.sort(sortMap[filters.sort]);
  }, [reviews, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const handleConfirmAssign = (doctor) => {
    if (!doctor || !assignTarget) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === assignTarget.id ? { ...r, doctorName: doctor.short } : r)),
    );

    if (!pushedToProfile.current.has(assignTarget.id)) {
      const target = getDoctor(doctor.id);
      if (target) {
        target.reviews = [
          {
            id: `b${assignTarget.id}`,
            name: assignTarget.name,
            initials: assignTarget.initials,
            avatarColor: assignTarget.avatarColor,
            source: assignTarget.source,
            date: assignTarget.date,
            rating: assignTarget.rating,
            tone: assignTarget.tone,
            url: assignTarget.url || '#',
            text: assignTarget.text,
          },
          ...target.reviews,
        ];
        target.reviewCount += 1;
      }
      pushedToProfile.current.add(assignTarget.id);
    }

    setAssignTarget(null);
    showToast(`Отзыв привязан к ${doctor.name}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          <i className="ti ti-building-hospital" />
          Филиал «{branch.name}»
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="ti ti-x" />
        </button>
      </div>

      <BranchMetrics branch={branch} period={period} />

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideTitle}>Распределение по звёздам</div>
            <StarDistribution stars={branch.stars} showNumbers />
          </div>
          <div className={styles.sideSection}>
            <div className={styles.sideTitle}>Распределение по источникам</div>
            <SourceDistribution sources={branch.sources} />
          </div>
        </div>

        <div className={styles.reviewsPane}>
          <ReviewFilters
            filters={filters}
            onChange={handleFilterChange}
            doctors={branchDoctorNames}
            sources={availableSources}
          />
          <div className={styles.reviewsList}>
            {paginated.length > 0
              ? paginated.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    isAdmin={isAdmin}
                    onAssign={setAssignTarget}
                  />
                ))
              : <div className={styles.empty}>Отзывов не найдено</div>
            }
          </div>
          <ReviewPagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {assignTarget && (
        <AssignModal
          review={assignTarget}
          branchName={branch.name}
          onCancel={() => setAssignTarget(null)}
          onConfirm={handleConfirmAssign}
        />
      )}

      {toast && (
        <div className={styles.toast}>
          <i className="ti ti-circle-check" />
          {toast}
        </div>
      )}
    </div>
  );
}
