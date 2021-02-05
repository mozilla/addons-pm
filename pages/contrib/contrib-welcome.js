import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';
import { getApiURL } from 'lib/utils';

const contribWelcomeURL = getApiURL('/api/gh-contrib-welcome/');

export async function getServerSideProps() {
  const contribWelcomeResponse = await fetch(contribWelcomeURL);
  const contribWelcomeData = await contribWelcomeResponse.json();
  return {
    props: {
      contribWelcomeData,
    },
  };
}

const ContribWelcome = (props) => {
  const { contribWelcomeData: initialContribWelcomeData } = props;
  const { data: contribData } = useSWR(
    contribWelcomeURL,
    async () => {
      const result = await fetch(contribWelcomeURL);
      const json = await result.json();
      return json;
    },
    { initialData: initialContribWelcomeData, refreshInterval: 30000 },
  );

  return (
    <Contrib
      contribData={formatContribData(contribData.data.contrib_welcome.results)}
    />
  );
};

export default ContribWelcome;
