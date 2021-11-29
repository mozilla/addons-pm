const validYears = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

module.exports = {
  validYears,
  validYearRX: new RegExp(`^(?:${validYears.join('|')})$`),
  validMilestoneRX: new RegExp(
    `^(?<year>${validYears.join(
      '|',
    )})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[1-2]\\d|3[0-1])$`,
  ),
  validQuarterRX: /^Q[1-4]$/,
  // This defined what team members projects can be filtered by since projects don't have
  // an official assignment.
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
  contribRepos: [
    'mozilla/addons',
    'mozilla/addons-code-manager',
    'mozilla/addons-blog',
    'mozilla/addons-server',
    'mozilla/addons-frontend',
    'mozilla/addons-linter',
    'mozilla/dispensary',
    'mozilla/extension-workshop',
    'mozilla/sign-addon',
    'mozilla/web-ext',
    'mozilla/webextension-polyfill',
    'mozilla/FirefoxColor',
  ],
  bugzilla: {
    priorities: ['--', 'P1', 'P2'],
    severities: ['normal', '--', 'N/A', 'S1', 'S2'],
    products: ['Toolkit', 'WebExtensions'],
    whiteboardTags: [
      '[mv3-m1]',
      '[mv3-m2]',
      '[mv3-m3]',
      '[mv3-future]',
      'stockwell',
      'addons-ux',
      'prod_bug',
    ],
  },
};
