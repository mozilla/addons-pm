import useSWR from 'swr';
import Contrib, { formatData } from 'components/Contrib';
import { API_ROOT } from 'lib/const';

export async function getServerSideProps() {
  const contribWelcomeURL = `${API_ROOT}/gh-contrib-welcome/`;
  const contribWelcomeResponse = await fetch(contribWelcomeURL);
  const contribWelcomeData = await contribWelcomeResponse.json();

  return {
    props: {
      data: contribWelcomeData,
      contribWelcomeURL,
    },
  };
}

const ContribWelcome = (props) => {
  const { data: initialContribWelcomeData, contribWelcomeURL } = props;
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
      contribData={formatData(contribData.data.contrib_welcome.results)}
    />
  );
};

export default ContribWelcome;
