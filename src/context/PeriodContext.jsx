import { createContext, useContext, useState, useMemo } from 'react';
import { PERIODS, DEFAULT_PERIOD, periodLabel } from '../data/clinic';

const PeriodContext = createContext(null);

const PERIOD_DAYS = {
  '30d': 30,
  quarter: 90,
  half: 180,
  year: 365,
};

function daysBetween(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 31;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function PeriodProvider({ children }) {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [range, setRange] = useState({ from: '', to: '' });

  const isAllTime = period === 'alltime';

  const periodDays = useMemo(() => {
    if (isAllTime) return null;
    if (period === 'custom') {
      return range.from && range.to ? daysBetween(range.from, range.to) : 31;
    }
    if (period === 'month') {
      const now = new Date();
      return now.getDate();
    }
    return PERIOD_DAYS[period] ?? 31;
  }, [period, range, isAllTime]);

  const dateRange = useMemo(() => {
    if (isAllTime) {
      return { from: '', to: toISODate(new Date()) };
    }
    if (period === 'custom' && range.from && range.to) {
      return { from: range.from, to: range.to };
    }
    if (period === 'month') {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: toISODate(from), to: toISODate(now) };
    }
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - periodDays);
    return { from: toISODate(from), to: toISODate(to) };
  }, [period, range, periodDays, isAllTime]);

  const prevRange = useMemo(() => {
    if (period !== 'month') return null;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: toISODate(from), to: toISODate(to) };
  }, [period]);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      range,
      setRange,
      periodDays,
      dateRange,
      prevRange,
      isAllTime,
      label: periodLabel(period),
      periods: PERIODS,
    }),
    [period, range, periodDays, dateRange, prevRange, isAllTime],
  );

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod must be used within PeriodProvider');
  return ctx;
}
