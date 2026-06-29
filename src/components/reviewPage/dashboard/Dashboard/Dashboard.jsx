import KpiGrid from '../KpiGrid/KpiGrid';
import ReviewsSection from '../ReviewsSection/ReviewsSection';
import BranchRatings from '../BranchRatings/BranchRatings';
import DynamicsChart from '../DynamicsChart/DynamicsChart';
import { usePeriod } from '../../../../context/PeriodContext';
import {
  kpiFor,
  FEED_BRANCH_REVIEWS,
  FEED_DOCTOR_REVIEWS,
  BRANCH_RATING_BARS,
  CHART_DATA,
} from '../../../../data/clinic';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { period, label } = usePeriod();
  const kpiItems = kpiFor(period);

  return (
    <div className={styles.dashboard}>
      <div className={styles.sectionLabel}>Ключевые показатели · {label}</div>
      <KpiGrid items={kpiItems} />

      <ReviewsSection
        branchFeed={{ title: 'По филиалам', icon: 'ti-building', todayCount: 7, reviews: FEED_BRANCH_REVIEWS }}
        doctorFeed={{ title: 'По врачам', icon: 'ti-stethoscope', todayCount: 4, reviews: FEED_DOCTOR_REVIEWS }}
      />

      <div className={styles.bottomRow}>
        <BranchRatings branches={BRANCH_RATING_BARS} />

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <i className="ti ti-chart-line" />
            Динамика отзывов
          </div>
          <DynamicsChart data={CHART_DATA} />
        </div>
      </div>
    </div>
  );
}
