import * as constants from './const';

describe('const.validYearRX', () => {
  it('should match valid content', () => {
    expect('2012').toMatch(constants.validYearRX);
    expect('2099').toMatch(constants.validYearRX);
  });

  it('should not match invalid content', () => {
    expect('201113').not.toMatch(constants.validYearRX);
    expect('1977').not.toMatch(constants.validYearRX);
  });
});

describe('const.validQuarterRX', () => {
  it('should match valid content', () => {
    expect('Q1').toMatch(constants.validQuarterRX);
    expect('Q3').toMatch(constants.validQuarterRX);
  });

  it('should not match invalid content', () => {
    expect('Q5').not.toMatch(constants.validQuarterRX);
    expect('whatever').not.toMatch(constants.validQuarterRX);
  });
});
