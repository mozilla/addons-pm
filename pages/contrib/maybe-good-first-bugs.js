import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';
import { API_ROOT } from 'lib/const';

export async function getServerSideProps() {
  const maybeGoodFirstBugsURL = `${API_ROOT}/gh-maybe-good-first-bugs/`;
  const maybeGoodFirstBugsResponse = await fetch(maybeGoodFirstBugsURL);
  const maybeGoodFirstBugsData = await maybeGoodFirstBugsResponse.json();

  return {
    props: {
      maybeGoodFirstBugsData,
      maybeGoodFirstBugsURL,
    },
  };
}

const MaybeGoodFirstBugs = (props) => {
  const {
    maybeGoodFirstBugsData: initialMaybeGoodFirstBugsData,
    maybeGoodFirstBugsURL,
  } = props;
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
