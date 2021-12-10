import queryString from 'query-string';
import { getNextMilestone, getMilestonePagination } from 'lib/utils/milestones';

export default function Page() {
  return null;
}

export async function getServerSideProps(oldProps) {
  let queryParams = '';
  const props = { ...oldProps };

  if (!props.query) {
    props.query = {};
  }

  props.query = { dir: 'asc', sort: 'assignee', ...props.query };
  queryParams = `?${queryString.stringify(props.query)}`;

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
