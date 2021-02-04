import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';

const maybeGoodFirstBugsURL = `${process.env.API_HOST}/api/gh-maybe-good-first-bugs/`;

export async function getServerSideProps() {
  const maybeGoodFirstBugsResponse = await fetch(maybeGoodFirstBugsURL);
  const maybeGoodFirstBugsData = await maybeGoodFirstBugsResponse.json();

  return {
    props: {
      maybeGoodFirstBugsData,
    },
  };
}

const MaybeGoodFirstBugs = (props) => {
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
