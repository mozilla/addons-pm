import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';

const goodFirstBugsURL = `${process.env.API_HOST}/api/gh-good-first-bugs/`;

export async function getServerSideProps() {
  const goodFirstBugsResponse = await fetch(goodFirstBugsURL);
  const goodFirstBugsData = await goodFirstBugsResponse.json();

  return {
    props: {
      goodFirstBugsData,
    },
  };
}

const GoodFirstBugs = (props) => {
  const { goodFirstBugsData: initialGoodFirstBugsData } = props;
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
