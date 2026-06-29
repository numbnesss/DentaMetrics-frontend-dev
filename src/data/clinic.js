export const PERIODS = [
  { key: '30d',     label: '30 дней' },
  { key: 'quarter', label: 'Квартал' },
  { key: 'half',    label: 'Полгода' },
  { key: 'year',    label: 'Год' },
  { key: 'custom',  label: 'Произвольный диапазон' },
];

export const DEFAULT_PERIOD = '30d';

export function periodLabel(key) {
  return PERIODS.find((p) => p.key === key)?.label ?? '30 дней';
}

export function trendFor(entity, period) {
  const raw = entity?.trends?.[period] ?? entity?.trends?.['30d'] ?? '+0.0';
  return { text: raw, dir: raw.trim().startsWith('-') ? 'down' : 'up' };
}

export function reviewTrendFor(entity, period) {
  const raw = entity?.reviewTrends?.[period] ?? entity?.reviewTrends?.['30d'] ?? '+0%';
  return { text: raw, dir: raw.trim().startsWith('-') ? 'down' : 'up' };
}

export const SOURCE_COLORS = {
  Google: '#378ADD',
  'Яндекс': '#EF9F27',
  '2ГИС': '#1D9E75',
  'ПроДокторов': '#9F77DD',
};

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

export const KPI_BY_PERIOD = {
  '30d': [
    { icon: 'ti-messages',          label: 'Всего отзывов',   value: '1 248', delta: { direction: 'up',   text: '+12% за период' } },
    { icon: 'ti-building-hospital', label: 'Рейтинг филиалов', value: '4.0',   delta: { direction: 'up',   text: '+0.1 за период' } },
    { icon: 'ti-stethoscope',       label: 'Рейтинг врачей',   value: '4.3',   delta: { direction: 'up',   text: '+0.2 за период' } },
    { icon: 'ti-mood-happy',        label: 'Позитивные',       value: '78%',   delta: { direction: 'up',   text: '+3% за период' } },
    { icon: 'ti-mood-sad',          label: 'Негативные',       value: '8%',    delta: { direction: 'down', text: '−1% за период' } },
  ],
  quarter: [
    { icon: 'ti-messages',          label: 'Всего отзывов',   value: '3 612', delta: { direction: 'up',   text: '+18% за период' } },
    { icon: 'ti-building-hospital', label: 'Рейтинг филиалов', value: '4.1',   delta: { direction: 'up',   text: '+0.2 за период' } },
    { icon: 'ti-stethoscope',       label: 'Рейтинг врачей',   value: '4.4',   delta: { direction: 'up',   text: '+0.3 за период' } },
    { icon: 'ti-mood-happy',        label: 'Позитивные',       value: '79%',   delta: { direction: 'up',   text: '+4% за период' } },
    { icon: 'ti-mood-sad',          label: 'Негативные',       value: '9%',    delta: { direction: 'down', text: '−2% за период' } },
  ],
  half: [
    { icon: 'ti-messages',          label: 'Всего отзывов',   value: '6 980', delta: { direction: 'up',   text: '+24% за период' } },
    { icon: 'ti-building-hospital', label: 'Рейтинг филиалов', value: '4.2',   delta: { direction: 'up',   text: '+0.4 за период' } },
    { icon: 'ti-stethoscope',       label: 'Рейтинг врачей',   value: '4.5',   delta: { direction: 'up',   text: '+0.4 за период' } },
    { icon: 'ti-mood-happy',        label: 'Позитивные',       value: '80%',   delta: { direction: 'up',   text: '+5% за период' } },
    { icon: 'ti-mood-sad',          label: 'Негативные',       value: '10%',   delta: { direction: 'down', text: '−2% за период' } },
  ],
  year: [
    { icon: 'ti-messages',          label: 'Всего отзывов',   value: '13 540', delta: { direction: 'up',   text: '+31% за период' } },
    { icon: 'ti-building-hospital', label: 'Рейтинг филиалов', value: '4.3',    delta: { direction: 'up',   text: '+0.6 за период' } },
    { icon: 'ti-stethoscope',       label: 'Рейтинг врачей',   value: '4.6',    delta: { direction: 'up',   text: '+0.5 за период' } },
    { icon: 'ti-mood-happy',        label: 'Позитивные',       value: '81%',    delta: { direction: 'up',   text: '+7% за период' } },
    { icon: 'ti-mood-sad',          label: 'Негативные',       value: '11%',    delta: { direction: 'down', text: '−3% за период' } },
  ],
};

export function kpiFor(period) {
  return KPI_BY_PERIOD[period] ?? KPI_BY_PERIOD['30d'];
}

export const FEED_BRANCH_REVIEWS = [
  { name: 'Анна Петрова',    rating: 5, source: 'Google', tone: 'positive', text: 'Отличный сервис, персонал очень вежливый и внимательный. Приём прошёл быстро, без очередей.' },
  { name: 'Иван Соколов',    rating: 3, source: 'Яндекс', tone: 'negative', text: 'Долго ждал в очереди, хотя запись была на конкретное время. Врач хороший, но организация подводит.' },
  { name: 'Мария Кузнецова', rating: 4, source: '2ГИС',   tone: 'positive', text: 'Удобное расположение, чистые кабинеты. Запись через приложение очень удобна, рекомендую.' },
];

export const FEED_DOCTOR_REVIEWS = [
  { name: 'Дмитрий Волков',    rating: 5, source: 'ПроДокторов', tone: 'positive', text: 'Доктор Иванова — замечательный специалист. Объяснила всё доступно, назначила правильное лечение.' },
  { name: 'Светлана Морозова', rating: 5, source: 'Google',      tone: 'positive', text: 'Хирург Смирнов провёл операцию безупречно. Реабилитация прошла без осложнений.' },
  { name: 'Олег Тихонов',      rating: 2, source: 'Яндекс',      tone: 'negative', text: 'К сожалению, доктор уделил совсем мало времени. Вопросы не были выслушаны до конца.' },
];

export const BRANCH_RATING_BARS = [
  { name: 'Центральный', rating: 4.7 },
  { name: 'Северный',    rating: 4.3 },
  { name: 'Южный',       rating: 3.8 },
  { name: 'Западный',    rating: 4.1 },
  { name: 'Восточный',   rating: 3.2 },
  { name: 'Академический', rating: 4.5 },
];

export const CHART_DATA = [
  { month: 'Ноя', positive: 210, negative: 60 },
  { month: 'Дек', positive: 245, negative: 55 },
  { month: 'Янв', positive: 198, negative: 70 },
  { month: 'Фев', positive: 280, negative: 48 },
  { month: 'Мар', positive: 310, negative: 42 },
  { month: 'Апр', positive: 295, negative: 50 },
  { month: 'Май', positive: 340, negative: 38 },
];

function sourceRatings(entries) {
  return entries.map(([name, value]) => ({ name, value, color: SOURCE_COLORS[name] }));
}

export const doctors = [
  {
    id: 1, name: 'Иванова Анна Петровна', short: 'Иванова А.П.', initials: 'ИА', avatarColor: '#378ADD',
    branch: 'Центральный', rating: 4.9, reviewCount: 148, positive: 94, neutral: 3, negative: 3,
    trends: { '30d': '+0.2', quarter: '+0.3', half: '+0.5', year: '+0.8' },
    stars: { 5: 118, 4: 22, 3: 5, 2: 2, 1: 1 },
    sources: [
      { name: 'Google', pct: 44, color: '#378ADD' },
      { name: 'Яндекс', pct: 30, color: '#EF9F27' },
      { name: '2ГИС', pct: 17, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 9, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.9], ['Яндекс', 4.8], ['2ГИС', 5.0], ['ПроДокторов', 4.9]]),
    reviews: [
      { id: 1,  name: 'Анна Петрова',      initials: 'АП', avatarColor: '#378ADD', source: 'Google',      date: '12.05.2025', rating: 5, tone: 'positive', url: 'https://google.com',      text: 'Замечательный врач! Очень внимательная, всё подробно объяснила. Лечение помогло, спасибо большое.' },
      { id: 2,  name: 'Иван Соколов',      initials: 'ИС', avatarColor: '#EF9F27', source: 'Яндекс',      date: '10.05.2025', rating: 5, tone: 'positive', url: 'https://yandex.ru',       text: 'Доктор Иванова — профессионал своего дела. Спокойно и доступно всё рассказала, назначила правильное лечение.' },
      { id: 3,  name: 'Мария Кузнецова',   initials: 'МК', avatarColor: '#1D9E75', source: '2ГИС',        date: '09.05.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',         text: 'Хороший специалист, приём прошёл быстро. Немного не хватило времени на вопросы, но в целом довольна.' },
      { id: 4,  name: 'Дмитрий Волков',    initials: 'ДВ', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '08.05.2025', rating: 5, tone: 'positive', url: 'https://prodoctorov.ru',  text: 'Прекрасный доктор. Записался по рекомендации, не пожалел. Внимательное отношение к пациенту.' },
      { id: 5,  name: 'Светлана Морозова', initials: 'СМ', avatarColor: '#E24B4A', source: 'Google',      date: '07.05.2025', rating: 5, tone: 'positive', url: 'https://google.com',      text: 'Очень довольна! Анна Петровна грамотно подобрала лечение. Рекомендую всем знакомым.' },
      { id: 6,  name: 'Олег Тихонов',      initials: 'ОТ', avatarColor: '#378ADD', source: 'Яндекс',      date: '06.05.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru',       text: 'Долго ждал приёма, хотя был записан. Сам приём прошёл нормально, но осадок остался.' },
      { id: 7,  name: 'Елена Васильева',   initials: 'ЕВ', avatarColor: '#1D9E75', source: '2ГИС',        date: '05.05.2025', rating: 5, tone: 'positive', url: 'https://2gis.ru',         text: 'Лучший врач в клинике! Всегда внимательна, никогда не торопит. Объясняет всё доступным языком.' },
      { id: 8,  name: 'Павел Громов',      initials: 'ПГ', avatarColor: '#EF9F27', source: 'Google',      date: '04.05.2025', rating: 4, tone: 'positive', url: 'https://google.com',      text: 'Хороший приём, доктор компетентная. Назначения помогли. Буду наблюдаться дальше.' },
      { id: 9,  name: 'Наталья Сидорова',  initials: 'НС', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '03.05.2025', rating: 5, tone: 'positive', url: 'https://prodoctorov.ru',  text: 'Спасибо за профессионализм и чуткое отношение. Очень редко встретишь таких врачей.' },
      { id: 10, name: 'Артём Зайцев',      initials: 'АЗ', avatarColor: '#E24B4A', source: 'Яндекс',      date: '02.05.2025', rating: 5, tone: 'positive', url: 'https://yandex.ru',       text: 'Отличный специалист. Помогла разобраться с проблемой, которую другие врачи не могли решить.' },
    ],
  },
  {
    id: 2, name: 'Смирнов Виктор Константинович', short: 'Смирнов В.К.', initials: 'СВ', avatarColor: '#1D9E75',
    branch: 'Центральный', rating: 4.7, reviewCount: 112, positive: 88, neutral: 6, negative: 6,
    trends: { '30d': '+0.1', quarter: '+0.2', half: '+0.3', year: '+0.6' },
    stars: { 5: 80, 4: 22, 3: 6, 2: 3, 1: 1 },
    sources: [
      { name: 'Google', pct: 40, color: '#378ADD' },
      { name: 'Яндекс', pct: 33, color: '#EF9F27' },
      { name: '2ГИС', pct: 18, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 9, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.8], ['Яндекс', 4.6], ['2ГИС', 4.7], ['ПроДокторов', 4.9]]),
    reviews: [
      { id: 21, name: 'Виктор Лебедев',  initials: 'ВЛ', avatarColor: '#378ADD', source: 'Google',      date: '11.05.2025', rating: 5, tone: 'positive', url: 'https://google.com',      text: 'Хирург от бога! Операция прошла идеально, реабилитация быстрая. Очень благодарен.' },
      { id: 22, name: 'Ирина Попова',    initials: 'ИП', avatarColor: '#EF9F27', source: 'Яндекс',      date: '09.05.2025', rating: 4, tone: 'positive', url: 'https://yandex.ru',       text: 'Грамотный врач, всё объяснил перед процедурой. Спокойно отнёсся к моим переживаниям.' },
      { id: 23, name: 'Сергей Козлов',   initials: 'СК', avatarColor: '#1D9E75', source: '2ГИС',        date: '07.05.2025', rating: 5, tone: 'positive', url: 'https://2gis.ru',         text: 'Профессионал высокого уровня. Доверяю только ему. Рекомендую без сомнений.' },
      { id: 24, name: 'Татьяна Орлова',  initials: 'ТО', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '05.05.2025', rating: 3, tone: 'neutral',  url: 'https://prodoctorov.ru',  text: 'Врач хороший, но очередь была большая. Пришлось ждать дольше запланированного.' },
      { id: 25, name: 'Роман Федоров',   initials: 'РФ', avatarColor: '#E24B4A', source: 'Google',      date: '03.05.2025', rating: 5, tone: 'positive', url: 'https://google.com',      text: 'Виктор Константинович — отличный специалист. Внимательный, аккуратный, всё на высшем уровне.' },
      { id: 26, name: 'Юлия Белова',     initials: 'ЮБ', avatarColor: '#378ADD', source: 'Яндекс',      date: '01.05.2025', rating: 5, tone: 'positive', url: 'https://yandex.ru',       text: 'Замечательный доктор. Провёл сложную операцию, всё прошло без осложнений. Спасибо!' },
      { id: 27, name: 'Андрей Макаров',  initials: 'АМ', avatarColor: '#1D9E75', source: '2ГИС',        date: '29.04.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',         text: 'Хороший хирург, доступно объясняет. Назначения помогли, доволен результатом.' },
      { id: 28, name: 'Оксана Титова',   initials: 'ОТ', avatarColor: '#EF9F27', source: 'Google',      date: '27.04.2025', rating: 5, tone: 'positive', url: 'https://google.com',      text: 'Лучший в своём деле. Спас мне здоровье, когда другие отказывались. Низкий поклон.' },
    ],
  },
  {
    id: 3, name: 'Петров Дмитрий Сергеевич', short: 'Петров Д.С.', initials: 'ПД', avatarColor: '#9F77DD',
    branch: 'Центральный', rating: 4.5, reviewCount: 89, positive: 82, neutral: 9, negative: 9,
    trends: { '30d': '+0.3', quarter: '+0.4', half: '+0.6', year: '+0.9' },
    stars: { 5: 55, 4: 21, 3: 8, 2: 3, 1: 2 },
    sources: [
      { name: 'Google', pct: 46, color: '#378ADD' },
      { name: 'ПроДокторов', pct: 28, color: '#9F77DD' },
      { name: 'Яндекс', pct: 18, color: '#EF9F27' },
      { name: '2ГИС', pct: 8, color: '#1D9E75' },
    ],
    sourceRatings: sourceRatings([['Google', 4.6], ['ПроДокторов', 4.7], ['Яндекс', 4.3], ['2ГИС', 4.4]]),
    reviews: [
      { id: 31, name: 'Ольга Рыбина',   initials: 'ОР', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '10.05.2025', rating: 5, tone: 'positive', url: 'https://prodoctorov.ru', text: 'Отличный ортодонт, знает своё дело. Поставил брекеты аккуратно, всё объяснил.' },
      { id: 32, name: 'Антон Власов',   initials: 'АВ', avatarColor: '#378ADD', source: 'Google',      date: '07.05.2025', rating: 4, tone: 'positive', url: 'https://google.com',     text: 'Хороший специалист, приём без спешки. Рекомендую.' },
      { id: 33, name: 'Дарья Носова',   initials: 'ДН', avatarColor: '#EF9F27', source: 'Яндекс',      date: '04.05.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru',      text: 'Нормально, но цены кусаются. Качество лечения хорошее.' },
      { id: 34, name: 'Игорь Лапин',    initials: 'ИЛ', avatarColor: '#1D9E75', source: '2ГИС',        date: '01.05.2025', rating: 2, tone: 'negative', url: 'https://2gis.ru',        text: 'Долго ждал приёма, хотя был записан заранее.' },
    ],
  },
  {
    id: 4, name: 'Козлова Марина Владимировна', short: 'Козлова М.В.', initials: 'КМ', avatarColor: '#EF9F27',
    branch: 'Северный', rating: 4.6, reviewCount: 97, positive: 86, neutral: 7, negative: 7,
    trends: { '30d': '+0.1', quarter: '+0.2', half: '+0.4', year: '+0.7' },
    stars: { 5: 62, 4: 22, 3: 8, 2: 3, 1: 2 },
    sources: [
      { name: 'Google', pct: 41, color: '#378ADD' },
      { name: '2ГИС', pct: 32, color: '#1D9E75' },
      { name: 'Яндекс', pct: 20, color: '#EF9F27' },
      { name: 'ПроДокторов', pct: 7, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.7], ['2ГИС', 4.6], ['Яндекс', 4.5], ['ПроДокторов', 4.6]]),
    reviews: [
      { id: 41, name: 'Наталья Лебедева', initials: 'НЛ', avatarColor: '#378ADD', source: 'Google', date: '09.05.2025', rating: 5, tone: 'positive', url: 'https://google.com', text: 'Лучший терапевт. Внимательная и аккуратная, лечение без боли.' },
      { id: 42, name: 'Павел Соков',      initials: 'ПС', avatarColor: '#1D9E75', source: '2ГИС',   date: '06.05.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',   text: 'Хорошая работа, аккуратно и быстро. Спасибо.' },
      { id: 43, name: 'Алина Белко',      initials: 'АБ', avatarColor: '#EF9F27', source: 'Яндекс', date: '02.05.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru', text: 'В целом нормально, но регистратура долго отвечала.' },
    ],
  },
  {
    id: 5, name: 'Новиков Алексей Романович', short: 'Новиков А.Р.', initials: 'НА', avatarColor: '#E24B4A',
    branch: 'Северный', rating: 4.2, reviewCount: 74, positive: 78, neutral: 8, negative: 14,
    trends: { '30d': '-0.1', quarter: '-0.2', half: '+0.1', year: '+0.3' },
    stars: { 5: 40, 4: 18, 3: 8, 2: 5, 1: 3 },
    sources: [
      { name: '2ГИС', pct: 44, color: '#1D9E75' },
      { name: 'Google', pct: 30, color: '#378ADD' },
      { name: 'Яндекс', pct: 18, color: '#EF9F27' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['2ГИС', 4.3], ['Google', 4.2], ['Яндекс', 4.0], ['ПроДокторов', 4.1]]),
    reviews: [
      { id: 51, name: 'Виктор Карпов',  initials: 'ВК', avatarColor: '#1D9E75', source: '2ГИС',   date: '08.05.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',   text: 'Удаление прошло быстро и без лишней боли.' },
      { id: 52, name: 'Алексей Минин',  initials: 'АМ', avatarColor: '#378ADD', source: 'Google', date: '05.05.2025', rating: 2, tone: 'negative', url: 'https://google.com', text: 'Не хватило подробных инструкций по уходу после процедуры.' },
      { id: 53, name: 'Жанна Котова',   initials: 'ЖК', avatarColor: '#EF9F27', source: 'Яндекс', date: '01.05.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru', text: 'Среднее впечатление. Врач нормальный, но без энтузиазма.' },
    ],
  },
  {
    id: 6, name: 'Дмитриев Сергей Андреевич', short: 'Дмитриев С.А.', initials: 'ДС', avatarColor: '#378ADD',
    branch: 'Южный', rating: 3.9, reviewCount: 63, positive: 68, neutral: 12, negative: 20,
    trends: { '30d': '-0.2', quarter: '-0.3', half: '-0.1', year: '+0.2' },
    stars: { 5: 28, 4: 16, 3: 9, 2: 6, 1: 4 },
    sources: [
      { name: 'Яндекс', pct: 38, color: '#EF9F27' },
      { name: 'Google', pct: 30, color: '#378ADD' },
      { name: '2ГИС', pct: 24, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Яндекс', 3.8], ['Google', 4.0], ['2ГИС', 3.9], ['ПроДокторов', 3.9]]),
    reviews: [
      { id: 61, name: 'Кирилл Борисов', initials: 'КБ', avatarColor: '#EF9F27', source: 'Яндекс', date: '07.05.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru', text: 'Средне. Врач торопился, не ответил на все вопросы.' },
      { id: 62, name: 'Мария Зуева',    initials: 'МЗ', avatarColor: '#378ADD', source: 'Google', date: '03.05.2025', rating: 2, tone: 'negative', url: 'https://google.com', text: 'Лечение пришлось переделывать в другой клинике.' },
      { id: 63, name: 'Олег Сухов',     initials: 'ОС', avatarColor: '#1D9E75', source: '2ГИС',   date: '30.04.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',   text: 'Нормальный приём, без нареканий. Доктор спокойный.' },
    ],
  },
  {
    id: 7, name: 'Романова Елена Викторовна', short: 'Романова Е.В.', initials: 'РЕ', avatarColor: '#1D9E75',
    branch: 'Южный', rating: 4.1, reviewCount: 58, positive: 74, neutral: 11, negative: 15,
    trends: { '30d': '+0.2', quarter: '+0.3', half: '+0.4', year: '+0.6' },
    stars: { 5: 30, 4: 16, 3: 6, 2: 4, 1: 2 },
    sources: [
      { name: 'Google', pct: 42, color: '#378ADD' },
      { name: 'Яндекс', pct: 28, color: '#EF9F27' },
      { name: '2ГИС', pct: 22, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.2], ['Яндекс', 4.0], ['2ГИС', 4.1], ['ПроДокторов', 4.0]]),
    reviews: [
      { id: 71, name: 'Алина Гусева',   initials: 'АГ', avatarColor: '#1D9E75', source: '2ГИС',   date: '06.05.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',   text: 'Доктор Романова внимательная, назначила хорошее лечение.' },
      { id: 72, name: 'Денис Орлов',    initials: 'ДО', avatarColor: '#378ADD', source: 'Google', date: '02.05.2025', rating: 5, tone: 'positive', url: 'https://google.com', text: 'Очень довольны! Профессионально и без боли.' },
      { id: 73, name: 'Вера Шилова',    initials: 'ВШ', avatarColor: '#EF9F27', source: 'Яндекс', date: '28.04.2025', rating: 3, tone: 'neutral',  url: 'https://yandex.ru', text: 'Нормально, но запись перенесли в последний момент.' },
    ],
  },
  {
    id: 8, name: 'Захаров Павел Игоревич', short: 'Захаров П.И.', initials: 'ЗП', avatarColor: '#9F77DD',
    branch: 'Южный', rating: 3.7, reviewCount: 45, positive: 62, neutral: 14, negative: 24,
    trends: { '30d': '-0.1', quarter: '-0.2', half: '-0.3', year: '+0.1' },
    stars: { 5: 18, 4: 12, 3: 7, 2: 5, 1: 3 },
    sources: [
      { name: 'Яндекс', pct: 40, color: '#EF9F27' },
      { name: 'Google', pct: 30, color: '#378ADD' },
      { name: '2ГИС', pct: 22, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Яндекс', 3.6], ['Google', 3.8], ['2ГИС', 3.7], ['ПроДокторов', 3.7]]),
    reviews: [
      { id: 81, name: 'Сергей Нилов',   initials: 'СН', avatarColor: '#EF9F27', source: 'Яндекс', date: '05.05.2025', rating: 1, tone: 'negative', url: 'https://yandex.ru', text: 'Пломба выпала через неделю. Разочарован.' },
      { id: 82, name: 'Ирина Гай',      initials: 'ИГ', avatarColor: '#1D9E75', source: '2ГИС',   date: '01.05.2025', rating: 4, tone: 'positive', url: 'https://2gis.ru',   text: 'Приём прошёл хорошо, но запись перенесли.' },
      { id: 83, name: 'Павел Дроздов',  initials: 'ПД', avatarColor: '#378ADD', source: 'Google', date: '27.04.2025', rating: 3, tone: 'neutral',  url: 'https://google.com', text: 'Среднее впечатление. Ничего особенного.' },
    ],
  },
  {
    id: 9, name: 'Алексеева Надежда Дмитриевна', short: 'Алексеева Н.Д.', initials: 'АН', avatarColor: '#EF9F27',
    branch: 'Западный', rating: 4.4, reviewCount: 52, positive: 83, neutral: 7, negative: 10,
    trends: { '30d': '+0.3', quarter: '+0.4', half: '+0.5', year: '+0.8' },
    stars: { 5: 32, 4: 13, 3: 4, 2: 2, 1: 1 },
    sources: [
      { name: 'Google', pct: 45, color: '#378ADD' },
      { name: 'Яндекс', pct: 30, color: '#EF9F27' },
      { name: '2ГИС', pct: 17, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.5], ['Яндекс', 4.3], ['2ГИС', 4.4], ['ПроДокторов', 4.4]]),
    reviews: [
      { id: 91, name: 'Денис Крылов',   initials: 'ДК', avatarColor: '#378ADD', source: 'Google', date: '08.05.2025', rating: 5, tone: 'positive', url: 'https://google.com', text: 'Доктор Алексеева очень профессиональная. Рекомендую.' },
      { id: 92, name: 'Жанна Миронова', initials: 'ЖМ', avatarColor: '#EF9F27', source: 'Яндекс', date: '04.05.2025', rating: 5, tone: 'positive', url: 'https://yandex.ru', text: 'Отличный персонал, быстрый приём. Очень довольна!' },
      { id: 93, name: 'Глеб Комаров',   initials: 'ГК', avatarColor: '#1D9E75', source: '2ГИС',   date: '30.04.2025', rating: 3, tone: 'neutral',  url: 'https://2gis.ru',   text: 'Неудобная парковка, сам приём нормальный.' },
    ],
  },
  {
    id: 10, name: 'Кириллов Олег Валентинович', short: 'Кириллов О.В.', initials: 'КО', avatarColor: '#E24B4A',
    branch: 'Западный', rating: 4.0, reviewCount: 38, positive: 72, neutral: 12, negative: 16,
    trends: { '30d': '+0.1', quarter: '+0.2', half: '+0.3', year: '+0.5' },
    stars: { 5: 18, 4: 11, 3: 5, 2: 3, 1: 1 },
    sources: [
      { name: 'Google', pct: 40, color: '#378ADD' },
      { name: 'Яндекс', pct: 33, color: '#EF9F27' },
      { name: '2ГИС', pct: 19, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    sourceRatings: sourceRatings([['Google', 4.1], ['Яндекс', 3.9], ['2ГИС', 4.0], ['ПроДокторов', 4.0]]),
    reviews: [
      { id: 101, name: 'Полина Ершова', initials: 'ПЕ', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '07.05.2025', rating: 4, tone: 'positive', url: 'https://prodoctorov.ru', text: 'Доктор Кириллов грамотный специалист. Лечение назначено правильно.' },
      { id: 102, name: 'Антон Жуков',   initials: 'АЖ', avatarColor: '#378ADD', source: 'Google',      date: '03.05.2025', rating: 3, tone: 'neutral',  url: 'https://google.com',     text: 'Нормально, без особых впечатлений.' },
      { id: 103, name: 'Светлана Юдина', initials: 'СЮ', avatarColor: '#EF9F27', source: 'Яндекс',     date: '29.04.2025', rating: 5, tone: 'positive', url: 'https://yandex.ru',      text: 'Очень внимательный доктор, всё подробно рассказал.' },
    ],
  },
];

export function getDoctor(id) {
  return doctors.find((d) => String(d.id) === String(id));
}

export function doctorsByBranch(branchName) {
  return doctors.filter((d) => d.branch === branchName);
}

export const DOCTOR_BRANCHES = ['Все филиалы', ...Array.from(new Set(doctors.map((d) => d.branch)))];

export const branches = [
  {
    id: 1, name: 'Центральный', rating: 4.7, reviewCount: 312,
    positive: 82, neutral: 10, negative: 8,
    trends: { '30d': '+0.2', quarter: '+0.4', half: '+0.6', year: '+0.9' },
    reviewTrends: { '30d': '+12%', quarter: '+18%', half: '+24%', year: '+31%' },
    stars: { 5: 210, 4: 68, 3: 22, 2: 8, 1: 4 },
    sources: [
      { name: 'Google', pct: 42, color: '#378ADD' },
      { name: 'Яндекс', pct: 31, color: '#EF9F27' },
      { name: '2ГИС', pct: 18, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 9, color: '#9F77DD' },
    ],
    reviews: [
      { id: 1,  name: 'Анна Петрова',      initials: 'АП', avatarColor: '#378ADD', source: 'Google',       date: '12.05.2025', rating: 5, tone: 'positive', hasReply: true,  reply: 'Спасибо за тёплый отзыв! Будем рады видеть вас снова.', url: 'https://google.com', doctorName: 'Иванова А.П.', text: 'Отличный сервис, персонал очень вежливый и внимательный. Приём прошёл быстро, без очередей.' },
      { id: 2,  name: 'Иван Соколов',      initials: 'ИС', avatarColor: '#EF9F27', source: 'Яндекс',       date: '10.05.2025', rating: 3, tone: 'neutral',  hasReply: false, url: 'https://yandex.ru',  text: 'Долго ждал в очереди, хотя запись была на конкретное время. Врач хороший, но организация подводит.' },
      { id: 3,  name: 'Мария Кузнецова',   initials: 'МК', avatarColor: '#1D9E75', source: '2ГИС',         date: '09.05.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Благодарим за рекомендацию! Рады, что вам было удобно.', url: 'https://2gis.ru', text: 'Удобное расположение, чистые кабинеты. Запись через приложение очень удобна, рекомендую.' },
      { id: 4,  name: 'Дмитрий Волков',    initials: 'ДВ', avatarColor: '#9F77DD', source: 'ПроДокторов',  date: '08.05.2025', rating: 5, tone: 'positive', hasReply: false, url: 'https://prodoctorov.ru', doctorName: 'Иванова А.П.', text: 'Доктор Иванова — замечательный специалист. Объяснила всё доступно, назначила правильное лечение.' },
      { id: 5,  name: 'Светлана Морозова', initials: 'СМ', avatarColor: '#E24B4A', source: 'Google',       date: '07.05.2025', rating: 5, tone: 'positive', hasReply: true,  reply: 'Спасибо! Передадим вашу благодарность Виктору Константиновичу.', url: 'https://google.com', doctorName: 'Смирнов В.К.', text: 'Хирург Смирнов провёл операцию безупречно. Реабилитация прошла без осложнений.' },
      { id: 6,  name: 'Олег Тихонов',      initials: 'ОТ', avatarColor: '#378ADD', source: 'Яндекс',       date: '06.05.2025', rating: 2, tone: 'negative', hasReply: false, url: 'https://yandex.ru',  text: 'К сожалению, доктор уделил совсем мало времени. Вопросы не были выслушаны до конца.' },
      { id: 7,  name: 'Елена Васильева',   initials: 'ЕВ', avatarColor: '#1D9E75', source: '2ГИС',         date: '05.05.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Спасибо за добрые слова!', url: 'https://2gis.ru', text: 'Очень довольна визитом. Всё чисто, персонал приветливый. Доктор подробно объяснил план лечения.' },
      { id: 8,  name: 'Павел Громов',      initials: 'ПГ', avatarColor: '#EF9F27', source: 'Google',       date: '04.05.2025', rating: 5, tone: 'positive', hasReply: false, url: 'https://google.com', text: 'Записался онлайн, приняли вовремя. Врач внимательный, всё объяснил. Буду рекомендовать.' },
      { id: 9,  name: 'Наталья Сидорова',  initials: 'НС', avatarColor: '#9F77DD', source: 'ПроДокторов',  date: '03.05.2025', rating: 1, tone: 'negative', hasReply: true,  reply: 'Приносим извинения за ситуацию. Свяжитесь с администратором — разберёмся.', url: 'https://prodoctorov.ru', text: 'Ужасная организация. Потеряли мою карту, пришлось ждать час. Больше не приду.' },
      { id: 10, name: 'Артём Зайцев',      initials: 'АЗ', avatarColor: '#E24B4A', source: 'Яндекс',       date: '02.05.2025', rating: 4, tone: 'positive', hasReply: false, url: 'https://yandex.ru',  text: 'Хорошая клиника, современное оборудование. Немного долго ждал, но в целом доволен.' },
    ],
  },
  {
    id: 2, name: 'Северный', rating: 4.3, reviewCount: 187,
    positive: 76, neutral: 12, negative: 12,
    trends: { '30d': '+0.1', quarter: '+0.2', half: '+0.4', year: '+0.7' },
    reviewTrends: { '30d': '+9%', quarter: '+14%', half: '+20%', year: '+27%' },
    stars: { 5: 112, 4: 48, 3: 18, 2: 6, 1: 3 },
    sources: [
      { name: 'Google', pct: 52, color: '#378ADD' },
      { name: 'Яндекс', pct: 48, color: '#EF9F27' },
    ],
    reviews: [
      { id: 11, name: 'Виктор Лебедев',  initials: 'ВЛ', avatarColor: '#378ADD', source: 'Google', date: '11.05.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Спасибо! Передадим Марине Владимировне.', url: 'https://google.com', doctorName: 'Козлова М.В.', text: 'Хорошая клиника, доктор Козлова очень внимательная. Рекомендую.' },
      { id: 12, name: 'Ирина Попова',    initials: 'ИП', avatarColor: '#EF9F27', source: 'Яндекс', date: '09.05.2025', rating: 2, tone: 'negative', hasReply: false, url: 'https://yandex.ru', text: 'Долгое ожидание, регистратура не отвечает на звонки. Разочарована.' },
      { id: 13, name: 'Сергей Козлов',   initials: 'СК', avatarColor: '#1D9E75', source: 'Google', date: '07.05.2025', rating: 5, tone: 'positive', hasReply: true,  reply: 'Благодарим за отзыв!', url: 'https://google.com', text: 'Отличный филиал, всё на высшем уровне. Персонал вежливый, чисто.' },
      { id: 14, name: 'Татьяна Орлова',  initials: 'ТО', avatarColor: '#9F77DD', source: 'Яндекс', date: '05.05.2025', rating: 4, tone: 'positive', hasReply: false, url: 'https://yandex.ru', doctorName: 'Новиков А.Р.', text: 'Врач Новиков очень грамотный специалист. Лечение назначено правильно.' },
      { id: 15, name: 'Роман Федоров',   initials: 'РФ', avatarColor: '#E24B4A', source: 'Google', date: '03.05.2025', rating: 3, tone: 'neutral',  hasReply: true,  reply: 'Спасибо за обратную связь, работаем над сроками приёма.', url: 'https://google.com', text: 'Средне. Ждал дольше чем записан. Врач нормальный но без энтузиазма.' },
      { id: 16, name: 'Юлия Белова',     initials: 'ЮБ', avatarColor: '#EF9F27', source: 'Яндекс', date: '01.05.2025', rating: 5, tone: 'positive', hasReply: false, url: 'https://yandex.ru', text: 'Прекрасный персонал, уютная обстановка. Обязательно вернусь.' },
      { id: 17, name: 'Андрей Макаров',  initials: 'АМ', avatarColor: '#378ADD', source: 'Google', date: '29.04.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Спасибо!', url: 'https://google.com', text: 'Хорошее место, удобная запись онлайн. Доктор всё объяснил подробно.' },
      { id: 18, name: 'Оксана Титова',   initials: 'ОТ', avatarColor: '#EF9F27', source: 'Яндекс', date: '27.04.2025', rating: 1, tone: 'negative', hasReply: false, url: 'https://yandex.ru', text: 'Потеряли результаты анализов. Пришлось сдавать повторно за свой счёт.' },
    ],
  },
  {
    id: 3, name: 'Южный', rating: 3.8, reviewCount: 143,
    positive: 64, neutral: 14, negative: 22,
    trends: { '30d': '-0.1', quarter: '-0.2', half: '+0.1', year: '+0.3' },
    reviewTrends: { '30d': '+3%', quarter: '+6%', half: '+11%', year: '+15%' },
    stars: { 5: 71, 4: 41, 3: 18, 2: 9, 1: 4 },
    sources: [
      { name: 'Google', pct: 45, color: '#378ADD' },
      { name: 'Яндекс', pct: 28, color: '#EF9F27' },
      { name: '2ГИС', pct: 17, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 10, color: '#9F77DD' },
    ],
    reviews: [
      { id: 21, name: 'Кирилл Борисов',  initials: 'КБ', avatarColor: '#378ADD', source: 'Google',      date: '10.05.2025', rating: 3, tone: 'neutral',  hasReply: false, url: 'https://google.com', doctorName: 'Дмитриев С.А.', text: 'Средняя клиника. Врач торопился, не ответил на все вопросы.' },
      { id: 22, name: 'Алина Гусева',    initials: 'АГ', avatarColor: '#1D9E75', source: '2ГИС',        date: '08.05.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Спасибо! Передадим Елене Викторовне.', url: 'https://2gis.ru', doctorName: 'Романова Е.В.', text: 'Неплохо. Доктор Романова внимательная, назначила хорошее лечение.' },
      { id: 23, name: 'Максим Щербаков', initials: 'МЩ', avatarColor: '#EF9F27', source: 'Яндекс',      date: '06.05.2025', rating: 2, tone: 'negative', hasReply: false, url: 'https://yandex.ru', text: 'Грубый администратор, долгое ожидание. Не рекомендую.' },
      { id: 24, name: 'Валерия Фролова', initials: 'ВФ', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '04.05.2025', rating: 5, tone: 'positive', hasReply: true,  reply: 'Благодарим! Захаров Павел Игоревич старается для каждого пациента.', url: 'https://prodoctorov.ru', doctorName: 'Захаров П.И.', text: 'Всё понравилось! Чисто, быстро, профессионально. Доктор Захаров — молодец.' },
      { id: 25, name: 'Николай Власов',  initials: 'НВ', avatarColor: '#E24B4A', source: 'Google',      date: '02.05.2025', rating: 3, tone: 'neutral',  hasReply: false, url: 'https://google.com', text: 'Запись удобная, но ждать пришлось 40 минут. Врач нормальный.' },
    ],
  },
  {
    id: 4, name: 'Западный', rating: 4.1, reviewCount: 98,
    positive: 71, neutral: 15, negative: 14,
    trends: { '30d': '+0.3', quarter: '+0.4', half: '+0.5', year: '+0.8' },
    reviewTrends: { '30d': '+15%', quarter: '+21%', half: '+27%', year: '+34%' },
    stars: { 5: 55, 4: 25, 3: 11, 2: 5, 1: 2 },
    sources: [
      { name: 'Google', pct: 40, color: '#378ADD' },
      { name: 'Яндекс', pct: 33, color: '#EF9F27' },
      { name: '2ГИС', pct: 19, color: '#1D9E75' },
      { name: 'ПроДокторов', pct: 8, color: '#9F77DD' },
    ],
    reviews: [
      { id: 31, name: 'Денис Крылов',   initials: 'ДК', avatarColor: '#378ADD', source: 'Google',      date: '11.05.2025', rating: 4, tone: 'positive', hasReply: true,  reply: 'Спасибо! Передадим Надежде Дмитриевне.', url: 'https://google.com', doctorName: 'Алексеева Н.Д.', text: 'Хорошая клиника, доктор Алексеева очень профессиональная.' },
      { id: 32, name: 'Жанна Миронова', initials: 'ЖМ', avatarColor: '#EF9F27', source: 'Яндекс',      date: '08.05.2025', rating: 5, tone: 'positive', hasReply: false, url: 'https://yandex.ru', text: 'Отличный персонал, быстрый приём. Очень довольна!' },
      { id: 33, name: 'Глеб Комаров',   initials: 'ГК', avatarColor: '#1D9E75', source: '2ГИС',        date: '05.05.2025', rating: 3, tone: 'neutral',  hasReply: true,  reply: 'Спасибо за отзыв, прорабатываем вопрос с парковкой.', url: 'https://2gis.ru', text: 'Неудобная парковка, пришлось долго искать место. Сам приём нормальный.' },
      { id: 34, name: 'Полина Ершова',  initials: 'ПЕ', avatarColor: '#9F77DD', source: 'ПроДокторов', date: '02.05.2025', rating: 4, tone: 'positive', hasReply: false, url: 'https://prodoctorov.ru', doctorName: 'Кириллов О.В.', text: 'Доктор Кириллов грамотный специалист. Лечение назначено правильно.' },
    ],
  },
];

export function getBranch(id) {
  return branches.find((b) => String(b.id) === String(id));
}
