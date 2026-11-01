import { DELTA_ICON } from '../../../../data/clinic';
import styles from './DeltaIndicator.module.css';

export default function DeltaIndicator({ direction, text }) {
  const dir = DELTA_ICON[direction] ? direction : 'flat';
  return (
    <div className={`${styles.delta} ${styles[dir]}`}>
      <i className={`ti ${DELTA_ICON[dir]} ${styles.icon}`} aria-hidden="true" />
      {text}
    </div>
  );
}
