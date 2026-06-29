import { useState } from 'react';
import BranchCard from '../BranchCard/BranchCard';
import BranchDetails from '../BranchDetails/BranchDetails';
import { usePeriod } from '../../../context/PeriodContext';
import { branches as BRANCHES } from '../../../data/clinic';
import styles from './Branches.module.css';

export default function Branches() {
  const { period, label } = usePeriod();
  const [openId, setOpenId] = useState(null);

  const handleCardClick = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const selectedBranch = BRANCHES.find((b) => b.id === openId);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="ti ti-building-hospital" />
          Филиалы
        </h1>
        <span className={styles.pageCount}>{BRANCHES.length} филиала · {label}</span>
      </div>

      <div className={styles.grid}>
        {BRANCHES.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            period={period}
            isOpen={openId === branch.id}
            onClick={() => handleCardClick(branch.id)}
          />
        ))}
      </div>

      {selectedBranch && (
        <BranchDetails
          key={selectedBranch.id}
          branch={selectedBranch}
          period={period}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
