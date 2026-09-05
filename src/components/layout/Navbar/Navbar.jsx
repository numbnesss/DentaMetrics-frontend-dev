import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePeriod } from '../../../context/PeriodContext';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/',         label: 'Обзор',   icon: 'ti-layout-dashboard', end: true },
  { to: '/branches', label: 'Филиалы', icon: 'ti-building-hospital' },
  { to: '/doctors',  label: 'Врачи',   icon: 'ti-stethoscope' },
];

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

function PeriodFilter() {
  const { period, setPeriod, label, periods, range, setRange } = usePeriod();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClose(ref, () => setOpen(false));

  const isCustom = period === 'custom';

  return (
    <div className={styles.periodWrap} ref={ref}>
      <button className={styles.periodBtn} onClick={() => setOpen((v) => !v)}>
        <i className="ti ti-calendar" />
        <span>{isCustom && range.from && range.to ? `${range.from} — ${range.to}` : label}</span>
        <i className={`ti ti-chevron-down ${styles.caret}`} />
      </button>

      {open && (
        <div className={styles.periodMenu}>
          {periods.map((p) => (
            <button
              key={p.key}
              className={`${styles.periodOption} ${p.key === period ? styles.periodSelected : ''}`}
              onClick={() => {
                setPeriod(p.key);
                if (p.key !== 'custom') setOpen(false);
              }}
            >
              {p.label}
            </button>
          ))}

          {isCustom && (
            <div className={styles.rangeBox}>
              <label className={styles.rangeLabel}>
                С
                <input
                  type="date"
                  className={styles.rangeInput}
                  value={range.from}
                  onChange={(e) => setRange({ ...range, from: e.target.value })}
                />
              </label>
              <label className={styles.rangeLabel}>
                По
                <input
                  type="date"
                  className={styles.rangeInput}
                  value={range.to}
                  onChange={(e) => setRange({ ...range, to: e.target.value })}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClose(ref, () => setOpen(false));

  const initials = user?.login ? user.login.slice(0, 2).toUpperCase() : '';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.userWrap} ref={ref}>
      <button className={styles.avatar} onClick={() => setOpen((v) => !v)} title={user?.login}>
        {initials}
      </button>

      {open && (
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.login}</div>
            <div className={styles.userRole}>{user?.role}</div>
          </div>
          <button className={styles.logout} onClick={handleLogout}>
            <i className="ti ti-logout" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <i className={`ti ti-tooth ${styles.logoIcon}`} />
          <span className={styles.logoText}>DentaMetric</span>
        </div>

        <nav className={styles.links}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <i className={`ti ${link.icon}`} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <PeriodFilter />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
