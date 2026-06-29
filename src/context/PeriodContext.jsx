import { createContext, useContext, useState, useMemo } from 'react';
import { PERIODS, DEFAULT_PERIOD, periodLabel } from '../data/clinic';

const PeriodContext = createContext(null);

export function PeriodProvider({ children }) {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  const [range, setRange] = useState({ from: '', to: '' });

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      range,
      setRange,
      label: periodLabel(period),
      periods: PERIODS,
    }),
    [period, range],
  );

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod must be used within PeriodProvider');
  return ctx;
}
