export const PERIODS = [
  { key: '30d',     label: '30 дней' },
  { key: 'month',   label: 'Месяц' },
  { key: 'quarter', label: 'Квартал' },
  { key: 'half',    label: 'Полгода' },
  { key: 'year',    label: 'Год' },
  { key: 'alltime', label: 'За все время' },
  { key: 'custom',  label: 'Произвольный диапазон' },
];

export const DEFAULT_PERIOD = '30d';

export function periodLabel(key) {
  return PERIODS.find((p) => p.key === key)?.label ?? '30 дней';
}

const AVATAR_PASTEL = {
  '#378ADD': { bg: '#E6F1FB', fg: '#0C447C' },
  '#1D9E75': { bg: '#E1F5EE', fg: '#085041' },
  '#EF9F27': { bg: '#FAEEDA', fg: '#633806' },
  '#E24B4A': { bg: '#FAECE7', fg: '#712B13' },
  '#9F77DD': { bg: '#EEEDFE', fg: '#3C3489' },
};

export function avatarStyle(color) {
  const p = AVATAR_PASTEL[color];
  return p ? { background: p.bg, color: p.fg } : { background: color, color: '#fff' };
}

const DOCTOR_AVATAR_COLORS = Object.keys(AVATAR_PASTEL);

export function avatarColor(seed) {
  if (!seed) return DOCTOR_AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % DOCTOR_AVATAR_COLORS.length;
  return DOCTOR_AVATAR_COLORS[index];
}

export const doctorAvatarColor = avatarColor;

export function doctorBranches(doctor) {
  const value = doctor?.branch_name;
  if (Array.isArray(value)) return Array.from(new Set(value.filter(Boolean)));
  return value ? [value] : [];
}

export function doctorBranchesLabel(doctor) {
  const list = doctorBranches(doctor);
  return list.length > 0 ? list.join(', ') : 'Филиал не указан';
}

export function doctorWorksIn(doctor, branchName) {
  return doctorBranches(doctor).includes(branchName);
}

export const DELTA_ICON = { up: 'ti-arrow-up', down: 'ti-arrow-down', flat: 'ti-arrow-right' };

export function deltaInfo(value, digits = 0) {
  if (value === undefined || value === null) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = 10 ** digits;
  const rounded = Math.round(number * factor) / factor;
  const direction = rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'flat';
  const sign = rounded > 0 ? '+' : '';
  return { direction, text: `${sign}${(rounded === 0 ? 0 : rounded).toFixed(digits)}` };
}
