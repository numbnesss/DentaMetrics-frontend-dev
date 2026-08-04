import StarDistribution from '../../branchesPage/StarDistribution/StarDistribution';
import SourceDistribution from '../../branchesPage/SourceDistribution/SourceDistribution';
import styles from './ProfileStats.module.css';

export default function ProfileStats({ stars, sourceDistribution }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <div className={styles.title}>Оценки</div>
        <StarDistribution stars={stars ?? {}} showNumbers />
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Источники</div>
        <SourceDistribution sources={sourceDistribution ?? []} />
      </div>
    </div>
  );
}
