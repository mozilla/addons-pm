import Page, { getServerSideProps } from 'pages/projects/latest';

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
    expect(redirect.destination).toMatch(/^\/projects\//);
  });
});
