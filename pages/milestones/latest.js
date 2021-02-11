import queryString from 'query-string';
import { getNextMilestone, getMilestonePagination } from 'lib/utils/milestones';

export default function Page() {
  return null;
}

export async function getServerSideProps(props) {
  let queryParams = '';
  if (props.query) {
    queryParams = `?${queryString.stringify(props.query)}`;
  }

  const milestonePagination = getMilestonePagination({
    startDate: getNextMilestone(),
  });

  return {
    redirect: {
      permanent: false,
      destination: `/milestones/${milestonePagination.current}/${queryParams}`,
    },
  };
}
