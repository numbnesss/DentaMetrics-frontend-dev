import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileStats from '../ProfileStats/ProfileStats';
import ProfileReviews from '../ProfileReviews/ProfileReviews';
import { getDoctor } from '../../../data/clinic';
import { usePeriod } from '../../../context/PeriodContext';
import styles from './DoctorProfile.module.css';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { period } = usePeriod();
  const doctor = getDoctor(id);

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
      <ProfileHeader doctor={doctor} period={period} />

      <div className={styles.body}>
        <div className={styles.left}>
          <ProfileStats stars={doctor.stars} sources={doctor.sources} />
        </div>
        <div className={styles.right}>
          <ProfileReviews reviews={doctor.reviews} />
        </div>
      </div>
    </div>
  );
}
