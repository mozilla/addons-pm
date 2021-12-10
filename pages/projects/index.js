import { getServerSideProps as latestRedirect } from './latest';

export default function Page() {
  return null;
}

export async function getServerSideProps(props) {
  return latestRedirect(props);
}
