import useSWR from 'swr';
import Contrib from 'components/Contrib';
import Error from 'next/error';
import { formatContribData } from 'lib/utils/contrib';
import { getApiURL } from 'lib/utils';

const contribWelcomeURL = getApiURL('/api/gh-contrib-welcome/');

export async function getServerSideProps() {
  const res = await fetch(contribWelcomeURL);
  const errorCode = res.ok ? false : res.status;
  const contribWelcomeData = await res.json();
  return {
    props: {
      errorCode,
      contribWelcomeData,
    },
  };
}

const ContribWelcome = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  const { contribWelcomeData: initialContribWelcomeData } = props;
  const { data: contribData } = useSWR(
    contribWelcomeURL,
    async () => {
      const result = await fetch(contribWelcomeURL);
      const json = await result.json();
      return json;
    },
    { fallbackData: initialContribWelcomeData, refreshInterval: 30000 },
  );

  return (
    <Contrib
      contribData={formatContribData(contribData.data.contrib_welcome.results)}
    />
  );
};

export default ContribWelcome;
