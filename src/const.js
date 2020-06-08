const validYears = ['2017', '2018', '2019', '2020'];

module.exports = {
  validYears: validYears,
  validYearRX: new RegExp(`^(?:${validYears.join('|')})$`),
  validMilestoneRX: new RegExp(
    `^(?:${validYears.join(
      '|',
    )})\\.(?:0[1-9]|1[0-2])\\.(?:0[1-9]|[1-2]\\d|3[0-1])$`,
  ),
  validQuarterRX: /^Q[1-4]$/,
  // This defined what team members projects can be filtered by since projects don't have an official
  // assignment.
  // It should contain anyone who owned an add-ons project past and present.
  // Note: Removing people no longer in the team will prevent old projects related to them
  // being accessible by URL.
  validProjectTeamMembers: [
    'entequak',
    'bobsilverberg',
    'diox',
    'eviljeff',
    'kumar303',
    'muffinresearch',
    'rebmullin',
    'wagnerand',
    'willdurand',
    'xlisachan',
  ],
  API_ROOT:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'http://localhost:3000/api',
  colors: {
    blocked: '#ffa500',
    closed: '#98ff98',
    contrib: '#C9B4F9',
    inProgress: '#fff176',
    invalid: '#EDEDED',
    priority: '#E92332',
    verified: '#00A21D',
    prReady: '#ffc107',
    open: '#666966',
    p1: '#ff0039',
    p2: '#d70022',
    p3: '#a4000f',
    p4: '#5a0002',
    p5: '#3e0200',
  },
  invalidStates: [
    'state: invalid',
    'state: duplicate',
    'state: works for me',
    'state: wontfix',
  ],
  priorities: ['p1', 'p2', 'p3', 'p4', 'p5'],
};
