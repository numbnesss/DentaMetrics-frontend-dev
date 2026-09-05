import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileStats from '../ProfileStats/ProfileStats';
import ProfileReviews from '../ProfileReviews/ProfileReviews';
import { usePeriod } from '../../../context/PeriodContext';
import { apiFetch } from '../../../api/apiFetch';
import styles from './DoctorProfile.module.css';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { periodDays, dateRange, prevRange, isAllTime } = usePeriod();

  const [doctor, setDoctor] = useState(null);
  const [sources, setSources] = useState([]);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
    fetchSources();
  }, [id, periodDays, isAllTime]);

  useEffect(() => {
    fetchTrend();
  }, [id, dateRange.from, dateRange.to, prevRange, isAllTime]);

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const url = isAllTime ? '/api/v1/doctors/alltime' : `/api/v1/doctors?period_days=${periodDays}`;
      const response = await apiFetch(url);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setDoctor(data.data.find((d) => String(d.id) === String(id)) ?? null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const fetchTrend = async () => {
    if (isAllTime) {
      setTrend({ avg_doctor_rating: 0, total_reviews: 0 });
      return;
    }
    try {
      const params = new URLSearchParams({ date_from: dateRange.from, date_to: dateRange.to });
      if (prevRange) {
        params.set('prev_date_from', prevRange.from);
        params.set('prev_date_to', prevRange.to);
      }
      const response = await apiFetch(`/api/v1/trend/doctor/${id}?${params}`);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setTrend(data.data.delta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sourceDistribution = useMemo(() => {
    const sourceMap = new Map(sources.map((s) => [s.id, s]));
    return (doctor?.source_breakdown ?? []).map((s) => ({
      name: s.source_name,
      pct: s.pct,
      color: sourceMap.get(s.source_id)?.color_hex || '#888',
    }));
  }, [doctor, sources]);

  if (loading) {
    return (
      <div className={styles.notFound}>
        <span>Загрузка данных врача...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={styles.notFound}>
        <i className="ti ti-user-off" />
        <span>Врач не найден</span>
        <button className={styles.backLink} onClick={() => navigate('/doctors')}>
          Назад к врачам
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ProfileHeader doctor={doctor} trend={trend} />

      <div className={styles.body}>
        <div className={styles.left}>
          <ProfileStats stars={doctor.stars} sourceDistribution={sourceDistribution} />
        </div>
        <div className={styles.right}>
          <ProfileReviews doctorId={id} sources={sources} />
        </div>
      </div>
    </div>
  );
}
