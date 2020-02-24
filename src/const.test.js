import * as constants from './const';

describe('const.validYearRX', () => {
  it('should match valid content', () => {
    expect('2019').toMatch(constants.validYearRX);
    expect('2020').toMatch(constants.validYearRX);
  });

  it('should not match invalid content', () => {
    expect('201113').not.toMatch(constants.validYearRX);
    expect('1977').not.toMatch(constants.validYearRX);
    expect('2016').not.toMatch(constants.validYearRX);
  });
});

describe('const.validQuarterRX', () => {
  it('should match valid content', () => {
    expect('Q1').toMatch(constants.validQuarterRX);
    expect('Q2').toMatch(constants.validQuarterRX);
    expect('Q3').toMatch(constants.validQuarterRX);
    expect('Q4').toMatch(constants.validQuarterRX);
  });

  it('should not match invalid content', () => {
    expect('Q5').not.toMatch(constants.validQuarterRX);
    expect('whatever').not.toMatch(constants.validQuarterRX);
  });
});

describe('const.validMilestoneRX', () => {
  it('should match valid content', () => {
    expect('2019.04.04').toMatch(constants.validMilestoneRX);
    expect('2018.03.12').toMatch(constants.validMilestoneRX);
    expect('2019.12.31').toMatch(constants.validMilestoneRX);
    expect('2019.01.01').toMatch(constants.validMilestoneRX);
  });

  it('should not match invalid content', () => {
    expect('2016.11.11').not.toMatch(constants.validMilestoneRX);
    expect('2019.11.32').not.toMatch(constants.validMilestoneRX);
    expect('2019.13.32').not.toMatch(constants.validMilestoneRX);
    expect('whatever').not.toMatch(constants.validMilestoneRX);
  });
});
