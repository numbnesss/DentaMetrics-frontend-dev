import { useState, useEffect, useMemo, useRef } from 'react';
import BranchMetrics from '../BranchMetrics/BranchMetrics';
import StarDistribution from '../StarDistribution/StarDistribution';
import SourceDistribution from '../SourceDistribution/SourceDistribution';
import ReviewFilters from '../ReviewFilters/ReviewFilters';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewPagination from '../ReviewPagination/ReviewPagination';
import AssignModal from '../AssignModal/AssignModal';
import { useAuth } from '../../../context/AuthContext';
import { usePeriod } from '../../../context/PeriodContext';
import { apiFetch } from '../../../api/apiFetch';
import styles from './BranchDetails.module.css';

export default function BranchDetails({ branch, doctors, sources, onClose }) {
  const { user } = useAuth();
  const { dateRange, prevRange, isAllTime } = usePeriod();
  const isAdmin = user?.role === 'admin';

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ sentiment: 'all', source: 'all', doctor: 'all', order: 'newest' });
  const [trend, setTrend] = useState(null);
  const [assigningReview, setAssigningReview] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [branch.id]);

  useEffect(() => {
    fetchReviews();
  }, [branch.id, page, filters]);

  useEffect(() => {
    fetchTrend();
  }, [branch.id, dateRange.from, dateRange.to, prevRange, isAllTime]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({ page: String(page), order: filters.order });
      if (filters.sentiment !== 'all') params.set('sentiment', filters.sentiment);
      if (filters.source !== 'all') params.set('source', filters.source);
      if (filters.doctor !== 'all') params.set('doctor_id', filters.doctor);

      const response = await apiFetch(`/api/v1/branches/${branch.id}/reviews?${params}`);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setReviews(data.data.reviews ?? []);
        setTotalPages(data.data.total_pages ?? 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrend = async () => {
    if (isAllTime) {
      setTrend({ total_reviews: 0, avg_branch_rating: 0, positive_pct: 0, negative_pct: 0 });
      return;
    }
    try {
      const params = new URLSearchParams({ date_from: dateRange.from, date_to: dateRange.to });
      if (prevRange) {
        params.set('prev_date_from', prevRange.from);
        params.set('prev_date_to', prevRange.to);
      }
      const response = await apiFetch(`/api/v1/trend/branch/${branch.id}?${params}`);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setTrend(data.data.delta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);
  const branchDoctors = useMemo(() => doctors.filter((d) => d.branch_name === branch.name), [doctors, branch.name]);

  const sourceDistribution = useMemo(
    () =>
      (branch.source_breakdown ?? []).map((s) => ({
        name: s.source_name,
        pct: s.pct,
        color: sourceMap.get(s.source_id)?.color_hex || '#888',
      })),
    [branch.source_breakdown, sourceMap],
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const handleAssignClick = (review) => {
    setAssigningReview(review);
  };

  const handleAssigned = (reviewId, doctorId, doctorName) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, doctor_id: doctorId, doctor_name: doctorName } : r)),
    );
    showToast('Отзыв привязан к врачу');
  };

  const handleUnassigned = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, doctor_id: null, doctor_name: null } : r)),
    );
    showToast('Отзыв отвязан от врача');
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.header}>
        <div className={styles.title}>
          <i className="ti ti-building-hospital" />
          Филиал «{branch.name}»
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="ti ti-x" />
        </button>
      </div>

      <BranchMetrics branch={branch} trend={trend} />

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideTitle}>Распределение по звёздам</div>
            <StarDistribution stars={branch.stars ?? {}} showNumbers />
          </div>
          <div className={styles.sideSection}>
            <div className={styles.sideTitle}>Распределение по источникам</div>
            <SourceDistribution sources={sourceDistribution} />
          </div>
        </div>

        <div className={styles.reviewsPane}>
          <ReviewFilters
            filters={filters}
            onChange={handleFilterChange}
            sources={sources}
            doctors={branchDoctors}
          />
          <div className={styles.reviewsList}>
            {reviews.length > 0
              ? reviews.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    source={sourceMap.get(r.source_id)}
                    isAdmin={isAdmin}
                    onAssignClick={() => handleAssignClick(r)}
                  />
                ))
              : (
                <div className={styles.empty}>
                  <i className="ti ti-inbox" />
                  Нет отзывов
                </div>
              )
            }
          </div>
          <ReviewPagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {assigningReview && (
        <AssignModal
          review={assigningReview}
          doctors={doctors}
          branchName={branch.name}
          onClose={() => setAssigningReview(null)}
          onAssigned={handleAssigned}
          onUnassigned={handleUnassigned}
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
