import { useEffect, useMemo, useState } from 'react';
import KpiGrid from '../KpiGrid/KpiGrid';
import SourceRatings from '../SourceRatings/SourceRatings';
import AllReviews from '../AllReviews/AllReviews';
import BranchRatings from '../BranchRatings/BranchRatings';
import DynamicsChart from '../DynamicsChart/DynamicsChart';
import ReviewFeed from '../ReviewFeed/ReviewFeed';
import { usePeriod } from '../../../../context/PeriodContext';
import { apiFetch } from '../../../../api/apiFetch';
import { deltaInfo } from '../../../../data/clinic';
import styles from './Dashboard.module.css';

const KPI_CONFIG = [
  { key: 'total_reviews',     icon: 'ti-messages',          label: 'Всего отзывов' },
  { key: 'avg_branch_rating', icon: 'ti-building-hospital', label: 'Рейтинг филиалов' },
  { key: 'avg_doctor_rating', icon: 'ti-stethoscope',       label: 'Рейтинг врачей' },
  { key: 'positive_pct',      icon: 'ti-mood-happy',        label: 'Позитивные' },
  { key: 'negative_pct',      icon: 'ti-mood-sad',          label: 'Негативные' },
];

function formatKpiValue(key, value) {
  if (value === undefined || value === null) return '—';
  if (key === 'positive_pct' || key === 'negative_pct') return `${value}%`;
  if (key === 'avg_branch_rating' || key === 'avg_doctor_rating') return value.toFixed(1);
  return value.toLocaleString('ru-RU');
}

function formatDelta(key, value) {
  const isPct = key === 'positive_pct' || key === 'negative_pct';
  const isRating = key === 'avg_branch_rating' || key === 'avg_doctor_rating';
  const info = deltaInfo(value, isPct ? 1 : isRating ? 2 : 0);
  if (!info) return null;
  return { direction: info.direction, text: `${info.text}${isPct ? '%' : ''} за период` };
}

function groupByMonth(points) {
  const buckets = new Map();

  points.forEach((point) => {
    const date = new Date(point.Period);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!buckets.has(key)) {
      buckets.set(key, {
        order: date.getFullYear() * 12 + date.getMonth(),
        month: `${date.toLocaleDateString('ru-RU', { month: 'short' })} ${String(date.getFullYear()).slice(2)}`,
        positive: 0,
        negative: 0,
      });
    }

    const bucket = buckets.get(key);
    bucket.positive += point.PositiveCount;
    bucket.negative += point.NegativeCount;
  });

  return Array.from(buckets.values()).sort((a, b) => a.order - b.order);
}

function todayISO() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Dashboard() {
  const { label, periodDays, periodQuery, dateRange, prevRange, isAllTime } = usePeriod();
  const [overview, setOverview] = useState(null);
  const [latestReviews, setLatestReviews] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sources, setSources] = useState([]);
  const [trendDelta, setTrendDelta] = useState(null);
  const [trendCurrent, setTrendCurrent] = useState(null);
  const [todayCount, setTodayCount] = useState(undefined);
  const [chartData, setChartData] = useState([]);
  const [sourceRatings, setSourceRatings] = useState([]);
  const [sourceRatingsUpdatedAt, setSourceRatingsUpdatedAt] = useState(null);

  useEffect(() => {
    fetchOverview();
    fetchTrend();
  }, [periodDays, dateRange.from, dateRange.to, prevRange, isAllTime]);

  useEffect(() => {
    fetchChart();
    fetchSources();
    fetchSourceRatings();
    fetchTodayCount();
  }, []);

  const fetchOverview = async () => {
    try {
      const url = `/api/v1/overview?${periodQuery}`;
      const response = await apiFetch(url);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setOverview(data.overview);
        setLatestReviews(data.latest_reviews ?? []);
        setBranches(data.branches ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrend = async () => {
    if (isAllTime) {
      setTrendDelta(null);
      setTrendCurrent(null);
      return;
    }
    try {
      const body = { date_from: dateRange.from, date_to: dateRange.to };
      if (prevRange) {
        body.prev_date_from = prevRange.from;
        body.prev_date_to = prevRange.to;
      }
      const response = await apiFetch('/api/v1/overview/trend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setTrendDelta(data.data.delta);
        setTrendCurrent(data.data.current);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayCount = async () => {
    try {
      const today = todayISO();
      const response = await apiFetch('/api/v1/overview/trend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_from: today, date_to: today }),
      });
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setTodayCount(data.data.current.total_reviews);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChart = async () => {
    try {
      const response = await apiFetch('/api/v1/overview/chart?period_days=365');
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setChartData(groupByMonth(data.overview));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSourceRatings = async () => {
    try {
      const response = await apiFetch('/api/v1/overview/avgrate');
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        const payload = data.data;
        setSourceRatings(Array.isArray(payload) ? payload : payload?.sources ?? []);
        setSourceRatingsUpdatedAt(Array.isArray(payload) ? null : payload?.updated_at ?? null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await apiFetch('/api/v1/sources');
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setSources(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const sourceRatingCards = sourceRatings.map((r) => ({
    ...r,
    current_rating: r.avg_rating ?? r.current_rating,
    color_hex: sourceMap.get(r.source_id)?.color_hex,
  }));

  const kpiSource = !isAllTime && trendCurrent ? trendCurrent : overview;

  const kpiItems = KPI_CONFIG.map((cfg) => ({
    icon: cfg.icon,
    label: cfg.label,
    value: formatKpiValue(cfg.key, kpiSource?.[cfg.key]),
    delta: formatDelta(cfg.key, trendDelta?.[cfg.key]),
  }));

  const branchBars = branches.map((b) => ({ name: b.name, rating: b.rating ?? 0 }));

  return (
    <div className={styles.dashboard}>
      <div className={styles.sectionLabel}>Ключевые показатели · {label}</div>
      <KpiGrid items={kpiItems} />

      <SourceRatings sources={sourceRatingCards} updatedAt={sourceRatingsUpdatedAt} />

      <ReviewFeed
        title="Последние отзывы"
        icon="ti-messages"
        todayCount={todayCount}
        reviews={latestReviews}
        sourceMap={sourceMap}
      />

      <div className={styles.bottomRow}>
        <BranchRatings branches={branchBars} />

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <i className="ti ti-chart-line" />
            Динамика отзывов
          </div>
          <DynamicsChart data={chartData} />
        </div>
      </div>

      <AllReviews sources={sources} />
    </div>
  );
}
