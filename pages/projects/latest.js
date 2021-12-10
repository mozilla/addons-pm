import queryString from 'query-string';
import { getCurrentQuarter } from 'lib/utils/projects';

export default function Page() {
  return null;
}

export async function getServerSideProps(props) {
  const { year, quarter } = getCurrentQuarter();

  let queryParams = '';
  if (props.query) {
    queryParams = `?${queryString.stringify(props.query)}`;
  }

  const destination = `/projects/${year}/${quarter}/${queryParams}}`;

  return {
    redirect: {
      permanent: false,
      destination,
    },
  };
}
