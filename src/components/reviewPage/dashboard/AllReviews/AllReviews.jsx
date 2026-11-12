import { useEffect, useMemo, useRef, useState } from 'react';
import ReviewCard from '../../../branchesPage/ReviewCard/ReviewCard';
import ReviewPagination from '../../../branchesPage/ReviewPagination/ReviewPagination';
import AssignModal from '../../../branchesPage/AssignModal/AssignModal';
import ReviewFilters from '../../../branchesPage/ReviewFilters/ReviewFilters';
import EditReviewModal from '../../../branchesPage/EditReviewModal/EditReviewModal';
import AddReviewModal from '../../../branchesPage/AddReviewModal/AddReviewModal';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../api/apiFetch';
import { doctorWorksIn } from '../../../../data/clinic';
import styles from './AllReviews.module.css';

// /api/v1/reviews принимает page и per_page (1–20), offset не читает
// и не присылает total / total_pages — есть ли следующая страница, понимаем по размеру ответа.
const PAGE_SIZE = 10;

const DEFAULT_FILTERS = { sentiment: 'all', source: 'all', branch: 'all', doctor: 'all', order: 'newest' };

// Общие фильтры отзывов из документации бэка: source — код источника, branch_id / doctor_id — UUID.
function buildQuery(page, filters) {
  const params = new URLSearchParams({ page: String(page), per_page: String(PAGE_SIZE), order: filters.order });
  if (filters.sentiment !== 'all') params.set('sentiment', filters.sentiment);
  if (filters.source !== 'all') params.set('source', filters.source);
  if (filters.branch !== 'all') params.set('branch_id', filters.branch);
  if (filters.doctor !== 'all') params.set('doctor_id', filters.doctor);
  return params.toString();
}

function isDefaultFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).every((key) => filters[key] === DEFAULT_FILTERS[key]);
}

function readPayload(payload) {
  if (payload === null || payload === undefined) {
    return { reviews: [], total: null, totalPages: null };
  }
  if (Array.isArray(payload)) {
    return { reviews: payload, total: null, totalPages: null };
  }
  return {
    reviews: payload?.reviews ?? [],
    total: payload?.total ?? null,
    totalPages: payload?.total_pages ?? null,
  };
}

export default function AllReviews({ sources }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [branches, setBranches] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const lastPageRef = useRef(null); // последняя страница, если уже знаем, где лента кончается
  const furthestFullRef = useRef(0); // самая дальняя полностью заполненная страница
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [assigningReview, setAssigningReview] = useState(null);
  const wrapRef = useRef(null);

  const sourceMap = useMemo(() => new Map((sources ?? []).map((s) => [s.id, s])), [sources]);

  useEffect(() => {
    let cancelled = false;

    apiFetch(`/api/v1/reviews?${buildQuery(page, filters)}`)
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok || data.result !== 'success') {
          setError('Не удалось загрузить отзывы');
          return;
        }
        const parsed = readPayload(data.data);

        // ушли за конец ленты (прошлая страница была ровно полной) — возвращаемся назад
        if (parsed.reviews.length === 0 && page > 1 && parsed.totalPages === null) {
          lastPageRef.current = page - 1;
          setPage(page - 1);
          return;
        }

        if (parsed.reviews.length < PAGE_SIZE) lastPageRef.current = page;
        else furthestFullRef.current = Math.max(furthestFullRef.current, page);

        setError('');
        setReviews(parsed.reviews.map((r) => ({ ...r, doctor_id: r.doctor_id ?? [] })));
        setTotal(parsed.total);
        setTotalPages(
          parsed.totalPages ?? lastPageRef.current ?? Math.max(furthestFullRef.current, page) + 1,
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError('Не удалось загрузить отзывы');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filters, reloadKey]);

  const resetPaging = () => {
    lastPageRef.current = null;
    furthestFullRef.current = 0;
  };

  const changeFilters = (nextFilters) => {
    resetPaging();
    setLoading(true);
    setFilters(nextFilters);
    setPage(1);
  };

  const resetFilters = () => changeFilters(DEFAULT_FILTERS);

  const changePage = (nextPage) => {
    if (nextPage === page) return;
    setLoading(true);
    setPage(nextPage);
    wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let cancelled = false;
    const load = (url, setter) =>
      apiFetch(url)
        .then((response) => response.json().then((data) => ({ response, data })))
        .then(({ response, data }) => {
          if (!cancelled && response.ok && data.result === 'success') setter(data.data ?? []);
        })
        .catch((err) => console.error(err));

    load('/api/v1/doctors?period_days=alltime', setDoctors);
    load('/api/v1/branches?period_days=alltime', setBranches);
    return () => {
      cancelled = true;
    };
  }, []);

  const filterDoctors = useMemo(() => {
    if (filters.branch === 'all') return doctors;
    const branchName = branches.find((b) => b.id === filters.branch)?.name;
    return branchName ? doctors.filter((d) => doctorWorksIn(d, branchName)) : doctors;
  }, [doctors, branches, filters.branch]);

  const handleSaved = (reviewId, doctorRefs) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, doctor_id: doctorRefs } : r)));
  };

  const handleUnassigned = (reviewId) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, doctor_id: [] } : r)));
  };

  const handleCreated = () => {
    resetPaging();
    setLoading(true);
    setPage(1);
    setReloadKey((k) => k + 1);
    setNotice('Отзыв добавлен');
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 2500);
  };

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const handleEdited = (updated) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + reviews.length - 1;

  return (
    <div className={styles.card} ref={wrapRef}>
      <div className={styles.header}>
        <span className={styles.title}>
          <i className="ti ti-messages" />
          Лента отзывов
        </span>
        <div className={styles.headerRight}>
          {notice && (
            <span className={styles.notice}>
              <i className="ti ti-circle-check" />
              {notice}
            </span>
          )}
          {reviews.length > 0 && (
            <span className={styles.counter}>
              Показано {from}–{to}
              {total !== null && ` из ${total}`}
            </span>
          )}
          {isAdmin && (
            <button type="button" className={styles.addBtn} onClick={() => setAddOpen(true)}>
              <i className="ti ti-plus" />
              Добавить отзыв
            </button>
          )}
        </div>
      </div>

      <ReviewFilters
        filters={filters}
        onChange={changeFilters}
        sources={sources ?? []}
        branches={branches}
        doctors={filterDoctors}
        onReset={isDefaultFilters(filters) ? undefined : resetFilters}
      />

      {error && <div className={styles.state}>{error}</div>}
      {!error && loading && reviews.length === 0 && <div className={styles.state}>Загрузка отзывов...</div>}
      {!error && !loading && reviews.length === 0 && (
        <div className={styles.state}>
          {isDefaultFilters(filters) ? 'Отзывов пока нет' : 'По выбранным фильтрам отзывов нет'}
        </div>
      )}

      {reviews.length > 0 && (
        <div className={`${styles.list} ${loading ? styles.dimmed : ''}`}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              source={sourceMap.get(review.source_id)}
              isAdmin={isAdmin}
              showBranch
              onAssignClick={() => setAssigningReview(review)}
              onEditClick={() => setEditingReview(review)}
            />
          ))}
        </div>
      )}

      <ReviewPagination page={page} totalPages={totalPages} onChange={changePage} />

      {assigningReview && (
        <AssignModal
          review={assigningReview}
          doctors={doctors}
          branchName={assigningReview.branch_name}
          onClose={() => setAssigningReview(null)}
          onSaved={handleSaved}
          onUnassigned={handleUnassigned}
        />
      )}

      {addOpen && (
        <AddReviewModal
          branches={branches}
          sources={sources ?? []}
          defaultBranchId={filters.branch !== 'all' ? filters.branch : ''}
          onClose={() => setAddOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          branches={branches}
          onClose={() => setEditingReview(null)}
          onSaved={handleEdited}
        />
      )}
    </div>
  );
}
