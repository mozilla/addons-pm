export const validYearRX = /^20\d{2}$/;
export const validQuarterRX = /^Q[1-4]{1}$/;
export const GH_API_ROOT =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api';

export const colors = {
  blocked: '#ffa500',
  closed: '#98ff98',
  contrib: '#C9B4F9',
  inprogress: '#fff176',
  invalid: '#EDEDED',
  priority: '#E92332',
  verified: '#00A21D',
  prready: '#ffc107',
  open: '#666966',
  p1: '#ff0039',
  p2: '#d70022',
  p3: '#a4000f',
  p4: '#5a0002',
  p5: '#3e0200',
};

export const priorities = ['p1', 'p2', 'p3', 'p4', 'p5'];
