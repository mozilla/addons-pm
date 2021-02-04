import useSWR from 'swr';
import Contrib from 'components/Contrib';
import { formatContribData } from 'lib/utils/contrib';
import { API_ROOT } from 'lib/const';

export async function getServerSideProps() {
  const contribWelcomeURL = `${API_ROOT}/gh-contrib-welcome/`;
  const contribWelcomeResponse = await fetch(contribWelcomeURL);
  const contribWelcomeData = await contribWelcomeResponse.json();

  return {
    props: {
      contribWelcomeData,
      contribWelcomeURL,
    },
  };
}

const ContribWelcome = (props) => {
  const {
    contribWelcomeData: initialContribWelcomeData,
    contribWelcomeURL,
  } = props;
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
