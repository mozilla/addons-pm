import { getCurrentQuarter } from 'lib/utils/projects';

export default function Page() {
  return null;
}

export async function getServerSideProps() {
  const { year, quarter } = getCurrentQuarter();
  const destination = `/projects/${year}/${quarter}/`;

  return {
    redirect: {
      permanent: false,
      destination,
    },
  };
}
