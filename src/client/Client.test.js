import Client from './Client';

describe('Client.getProjects()', () => {
  it('throws if input year is bad', async () => {
    try {
      await Client.getProjects('bad-year', 'Q3');
    } catch (e) {
      expect(e.message).toMatch('Invalid Year');
    }
  });

  it('throws if input quarter is bad', async () => {
    try {
      await Client.getProjects('2018', 'Q20');
    } catch (e) {
      expect(e.message).toMatch('Invalid Quarter');
    }
  });
});

describe('Client.checkStatus()', () => {
  it('throws if response status is not 200', () => {
    const response = new Response('FAIL', {
      status: 500,
      statusText: 'soz',
    });
    try {
      Client.checkStatus(response);
    } catch (e) {
      expect(e.message).toMatch(/soz/);
    }
  });
});

describe('Client.getMilestones()', () => {
  it('throws if milestone is invalie', async () => {
    try {
      await Client.getMilestoneIssues('whatever');
    } catch (e) {
      expect(e.message).toMatch('Invalid Milestone');
    }
  });
});
