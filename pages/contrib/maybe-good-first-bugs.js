import useSWR from 'swr';
import Error from 'next/error';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';
import { getApiURL } from 'lib/utils';

const maybeGoodFirstBugsURL = getApiURL('/api/gh-maybe-good-first-bugs/');

export async function getServerSideProps() {
  const res = await fetch(maybeGoodFirstBugsURL);
  const errorCode = res.ok ? false : res.status;
  const maybeGoodFirstBugsData = await res.json();

  return {
    props: {
      errorCode,
      maybeGoodFirstBugsData,
    },
  };
}

const MaybeGoodFirstBugs = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  const { maybeGoodFirstBugsData: initialMaybeGoodFirstBugsData } = props;
  const { data: maybeGoodFirstBugsData } = useSWR(
    maybeGoodFirstBugsURL,
    async () => {
      const result = await fetch(maybeGoodFirstBugsURL);
      const json = await result.json();
      return json;
    },
    { initialData: initialMaybeGoodFirstBugsData, refreshInterval: 30000 },
  );

  return (
    <Contrib
      contribData={formatContribData(
        maybeGoodFirstBugsData.data.maybe_good_first_bugs.results,
      )}
      hasAssignments
    />
  );
};

export default MaybeGoodFirstBugs;
