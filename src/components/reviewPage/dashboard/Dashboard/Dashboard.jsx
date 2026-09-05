import { useEffect, useMemo, useState } from 'react';
import KpiGrid from '../KpiGrid/KpiGrid';
import SourceRatings from '../SourceRatings/SourceRatings';
import BranchRatings from '../BranchRatings/BranchRatings';
import DynamicsChart from '../DynamicsChart/DynamicsChart';
import ReviewFeed from '../ReviewFeed/ReviewFeed';
import { usePeriod } from '../../../../context/PeriodContext';
import { apiFetch } from '../../../../api/apiFetch';
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
  if (value === undefined || value === null) return null;
  const direction = value >= 0 ? 'up' : 'down';
  const sign = value >= 0 ? '+' : '';

  if (key === 'positive_pct' || key === 'negative_pct') {
    return { direction, text: `${sign}${value.toFixed(1)}% за период` };
  }
  if (key === 'avg_branch_rating' || key === 'avg_doctor_rating') {
    return { direction, text: `${sign}${value.toFixed(2)} за период` };
  }
  return { direction, text: `${sign}${value} за период` };
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
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { label, periodDays, dateRange, prevRange, isAllTime } = usePeriod();
  const [overview, setOverview] = useState(null);
  const [latestReviews, setLatestReviews] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sources, setSources] = useState([]);
  const [trendDelta, setTrendDelta] = useState(null);
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
    fetchTodayCount();
    fetchSourceRatings();
  }, []);

  const fetchOverview = async () => {
    try {
      const url = isAllTime ? '/api/v1/overview/alltime' : `/api/v1/overview?period_days=${periodDays}`;
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
      setTrendDelta(Object.fromEntries(KPI_CONFIG.map((cfg) => [cfg.key, 0])));
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

  const fetchSourceRatings = async () => {
    try {
      const response = await apiFetch('/api/v1/overview/ratings-by-source');
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setSourceRatings(data.data.sources ?? []);
        setSourceRatingsUpdatedAt(data.data.updated_at ?? null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const kpiItems = KPI_CONFIG.map((cfg) => ({
    icon: cfg.icon,
    label: cfg.label,
    value: formatKpiValue(cfg.key, overview?.[cfg.key]),
    delta: formatDelta(cfg.key, trendDelta?.[cfg.key]),
  }));

  const branchBars = branches.map((b) => ({ name: b.name, rating: b.rating ?? 0 }));

  return (
    <div className={styles.dashboard}>
      <div className={styles.sectionLabel}>Ключевые показатели · {label}</div>
      <KpiGrid items={kpiItems} />

      <SourceRatings sources={sourceRatings} updatedAt={sourceRatingsUpdatedAt} />

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
    </div>
  );
}
