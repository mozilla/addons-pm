import useSWR from 'swr';
import Error from 'next/error';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';
import { getApiURL } from 'lib/utils';

const goodFirstBugsURL = getApiURL('/api/gh-good-first-bugs/');

export async function getServerSideProps() {
  const res = await fetch(goodFirstBugsURL);
  const errorCode = res.ok ? false : res.status;
  const goodFirstBugsData = await res.json();

  return {
    props: {
      errorCode,
      goodFirstBugsData,
    },
  };
}

const GoodFirstBugs = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

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
