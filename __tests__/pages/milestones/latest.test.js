import Page, { getServerSideProps } from 'pages/milestones/latest';

describe('Milestones Latest Redirect', () => {
  describe('Page', () => {
    it('should return null from Page', () => {
      expect(Page()).toBe(null);
    });
  });

  describe('getServerSideProps', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
  });
});
