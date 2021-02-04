import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { API_ROOT } from 'lib/const';
import { formatContribData } from 'lib/utils/contrib';

export async function getServerSideProps() {
  const goodFirstBugsURL = `${API_ROOT}/gh-good-first-bugs/`;
  const goodFirstBugsResponse = await fetch(goodFirstBugsURL);
  const goodFirstBugsData = await goodFirstBugsResponse.json();

  return {
    props: {
      goodFirstBugsData,
      goodFirstBugsURL,
    },
  };
}

const GoodFirstBugs = (props) => {
  const {
    goodFirstBugsData: initialGoodFirstBugsData,
    goodFirstBugsURL,
  } = props;
  const { data: goodFirstBugsData } = useSWR(
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
      contribData={formatContribData(
        goodFirstBugsData.data.good_first_bugs.results,
      )}
      hasAssignments
    />
  );
};

export default GoodFirstBugs;
