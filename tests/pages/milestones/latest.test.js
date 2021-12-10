import Page, { getServerSideProps } from 'pages/milestones/latest';

describe(__filename, () => {
  it("should not render anything as it's a redirect", () => {
    expect(Page()).toEqual(null);
  });

  it('should return redirect data', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
  });

  it('should set default query params if not defined', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
    expect(redirect.destination).toMatch(/sort=assignee/);
    expect(redirect.destination).toMatch(/dir=asc/);
  });

  it('should not override supplied dir query param if defined', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
        dir: 'desc',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
    expect(redirect.destination).toMatch(/sort=assignee/);
    expect(redirect.destination).toMatch(/dir=desc/);
  });

  it('should not override supplied sort query params if defined', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
        sort: 'whatever',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
    expect(redirect.destination).toMatch(/sort=whatever/);
    expect(redirect.destination).toMatch(/dir=asc/);
  });

  it('should still redir with no query object', async () => {
    const fakeProps = {};
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/milestones\//);
    expect(redirect.destination).toMatch(/sort=assignee/);
    expect(redirect.destination).toMatch(/dir=asc/);
  });
});
