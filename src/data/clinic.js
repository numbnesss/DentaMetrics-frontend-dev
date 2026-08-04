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
