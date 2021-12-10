import Page, { getServerSideProps } from 'pages/projects/index';

describe(__filename, () => {
  it("should not render anything as it's a redirect", () => {
    expect(Page()).toEqual(null);
  });

  it('should return redirect data and pass on query params', async () => {
    const fakeProps = {
      query: {
        foo: 'bar',
      },
    };
    const { redirect } = await getServerSideProps(fakeProps);
    expect(redirect.permanent).toEqual(false);
    expect(redirect.destination).toMatch(/^\/projects\//);
    expect(redirect.destination).toMatch(/foo=bar/);
  });
});
