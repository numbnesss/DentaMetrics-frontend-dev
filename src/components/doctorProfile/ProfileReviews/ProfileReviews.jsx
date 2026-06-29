import { useState, useMemo } from 'react';
import ProfileReviewCard from './ProfileReviewCard';
import ReviewPagination from '../../branchesPage/ReviewPagination/ReviewPagination';
import styles from './ProfileReviews.module.css';

const PAGE_SIZE = 7;

export default function ProfileReviews({ reviews }) {
  const [tone, setTone]     = useState('all');
  const [source, setSource] = useState('all');
  const [sortRating, setSortRating] = useState('none');
  const [sortDate, setSortDate]     = useState('date_desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (tone !== 'all') list = list.filter((r) => r.tone === tone);
    if (source !== 'all') list = list.filter((r) => r.source === source);

    list.sort((a, b) => {
      if (sortRating === 'rating_desc' && b.rating !== a.rating) return b.rating - a.rating;
      if (sortRating === 'rating_asc'  && a.rating !== b.rating) return a.rating - b.rating;
      return sortDate === 'date_desc' ? b.id - a.id : a.id - b.id;
    });
    return list;
  }, [reviews, tone, source, sortRating, sortDate]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = (fn) => (val) => { fn(val); setPage(1); };

  return (
    <div className={styles.wrap}>
      <div className={styles.filtersBar}>
        <div className={styles.filters}>
          <select className={styles.select} value={tone} onChange={(e) => resetPage(setTone)(e.target.value)}>
            <option value="all">Все тональности</option>
            <option value="positive">Позитивные</option>
            <option value="neutral">Нейтральные</option>
            <option value="negative">Негативные</option>
          </select>

          <select className={styles.select} value={source} onChange={(e) => resetPage(setSource)(e.target.value)}>
            <option value="all">Все источники</option>
            <option value="Google">Google</option>
            <option value="Яндекс">Яндекс</option>
            <option value="2ГИС">2ГИС</option>
            <option value="ПроДокторов">ПроДокторов</option>
          </select>

          <select className={styles.select} value={sortRating} onChange={(e) => resetPage(setSortRating)(e.target.value)}>
            <option value="none">Рейтинг: без сортировки</option>
            <option value="rating_desc">Рейтинг ↓</option>
            <option value="rating_asc">Рейтинг ↑</option>
          </select>

          <select className={styles.select} value={sortDate} onChange={(e) => resetPage(setSortDate)(e.target.value)}>
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
          </select>
        </div>
      </div>

      <div className={styles.list}>
        {paginated.length > 0
          ? paginated.map((r) => <ProfileReviewCard key={r.id} review={r} />)
          : <div className={styles.empty}>Отзывов не найдено</div>
        }
      </div>

      <ReviewPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
