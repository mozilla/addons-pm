// Jest.config.js
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  collectCoverageFrom: ['**/*.{js,jsx}'],
  // The directory where Jest should output its coverage files
  coverageDirectory: '.coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/fixtures/',
    '<rootDir>/.next/',
    '<rootDir>/.coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/jest.setup.js',
    '<rootDir>/next.config.js',
  ],
  // Module lookup ordering.
  moduleDirectories: ['<rootDir>', 'node_modules'],
  // A list of paths to modules that run some code to configure or set up the testing
  // framework before each test
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(scss|css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
