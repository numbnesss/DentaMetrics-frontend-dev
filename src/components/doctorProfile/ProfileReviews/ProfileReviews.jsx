import { useState, useEffect, useMemo } from 'react';
import ProfileReviewCard from './ProfileReviewCard';
import ReviewPagination from '../../branchesPage/ReviewPagination/ReviewPagination';
import { apiFetch } from '../../../api/apiFetch';
import styles from './ProfileReviews.module.css';

export default function ProfileReviews({ doctorId, sources }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ sentiment: 'all', source: 'all', order: 'newest' });

  useEffect(() => {
    fetchReviews();
  }, [doctorId, page, filters]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({ page: String(page), order: filters.order });
      if (filters.sentiment !== 'all') params.set('sentiment', filters.sentiment);
      if (filters.source !== 'all') params.set('source', filters.source);

      const response = await apiFetch(`/api/v1/doctors/${doctorId}/reviews?${params}`);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setReviews(data.data.reviews ?? []);
        setTotalPages(data.data.total_pages ?? 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.filtersBar}>
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={filters.sentiment}
            onChange={(e) => handleFilterChange({ ...filters, sentiment: e.target.value })}
          >
            <option value="all">Все тональности</option>
            <option value="positive">Позитивные</option>
            <option value="negative">Негативные</option>
          </select>

          <select
            className={styles.select}
            value={filters.source}
            onChange={(e) => handleFilterChange({ ...filters, source: e.target.value })}
          >
            <option value="all">Все источники</option>
            {sources.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.order}
            onChange={(e) => handleFilterChange({ ...filters, order: e.target.value })}
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>
      </div>

      <div className={styles.list}>
        {reviews.length > 0
          ? reviews.map((r) => <ProfileReviewCard key={r.id} review={r} source={sourceMap.get(r.source_id)} />)
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
  );
}
