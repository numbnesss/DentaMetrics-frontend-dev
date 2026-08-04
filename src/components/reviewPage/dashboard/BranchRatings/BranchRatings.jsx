import BranchBar from '../BranchBar/BranchBar';
import styles from './BranchRatings.module.css';

export default function BranchRatings({ branches }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <i className="ti ti-building-hospital" />
        Рейтинг филиалов
      </div>
      {branches.map((branch) => (
        <BranchBar key={branch.name} name={branch.name} rating={branch.rating} />
      ))}
    </div>
  );
}
