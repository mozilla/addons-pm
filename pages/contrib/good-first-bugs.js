import useSWR from 'swr';
import Contrib, { formatData } from 'components/Contrib';
import { API_ROOT } from 'lib/const';

export async function getServerSideProps() {
  const goodFirstBugsURL = `${API_ROOT}/gh-good-first-bugs/`;
  const goodFirstBugsResponse = await fetch(goodFirstBugsURL);
  const goodFirstBugsData = await goodFirstBugsResponse.json();

  return {
    props: {
      data: goodFirstBugsData,
      goodFirstBugsURL,
    },
  };
}

const GoodFirstBugs = (props) => {
  const { data: initialGoodFirstBugsData, goodFirstBugsURL } = props;
  const { data: goodFirstBugData } = useSWR(
    goodFirstBugsURL,
    async () => {
      const result = await fetch(goodFirstBugsURL);
      const json = await result.json();
      return json;
    },
    { initialData: initialGoodFirstBugsData, refreshInterval: 30000 },
  );

  return (
    <Contrib
      contribData={formatData(goodFirstBugData.data.good_first_bugs.results)}
      hasAssignments
    />
  );
};

export default GoodFirstBugs;
