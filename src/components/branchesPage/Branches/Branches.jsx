import { useEffect, useState } from 'react';
import BranchCard from '../BranchCard/BranchCard';
import BranchDetails from '../BranchDetails/BranchDetails';
import { usePeriod } from '../../../context/PeriodContext';
import { apiFetch } from '../../../api/apiFetch';
import styles from './Branches.module.css';

export default function Branches() {
  const { label, periodDays, dateRange, prevRange, isAllTime } = usePeriod();
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [sources, setSources] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchDoctors();
    fetchSources();
  }, [periodDays, isAllTime]);

  useEffect(() => {
    if (isAllTime) {
      const zeroTrend = { total_reviews: 0, avg_branch_rating: 0, positive_pct: 0, negative_pct: 0 };
      setBranches((prev) => prev.map((b) => ({ ...b, trend: zeroTrend })));
      return;
    }
    if (branches.length > 0) fetchTrends();
  }, [branches.map((b) => b.id).join(','), dateRange.from, dateRange.to, prevRange, isAllTime]);

  const fetchBranches = async () => {
    try {
      const url = isAllTime ? '/api/v1/branches/alltime' : `/api/v1/branches?period_days=${periodDays}`;
      const response = await apiFetch(url);
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setBranches(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrends = async () => {
    const params = new URLSearchParams({ date_from: dateRange.from, date_to: dateRange.to });
    if (prevRange) {
      params.set('prev_date_from', prevRange.from);
      params.set('prev_date_to', prevRange.to);
    }
    const results = await Promise.all(
      branches.map(async (branch) => {
        try {
          const response = await apiFetch(`/api/v1/trend/branch/${branch.id}?${params}`);
          const data = await response.json();
          return response.ok && data.result === 'success' ? [branch.id, data.data.delta] : [branch.id, null];
        } catch (error) {
          console.error(error);
          return [branch.id, null];
        }
      }),
    );
    const trendMap = new Map(results);
    setBranches((prev) => prev.map((b) => ({ ...b, trend: trendMap.get(b.id) ?? null })));
  };

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

  const handleCardClick = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const selectedBranch = branches.find((b) => b.id === openId);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="ti ti-building-hospital" />
          Филиалы
        </h1>
        <span className={styles.pageCount}>{branches.length} филиала · {label}</span>
      </div>

      <div className={styles.grid}>
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isOpen={openId === branch.id}
            onClick={() => handleCardClick(branch.id)}
          />
        ))}
      </div>

      {selectedBranch && (
        <BranchDetails
          key={selectedBranch.id}
          branch={selectedBranch}
          doctors={doctors}
          sources={sources}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
