import { useRouter } from 'next/router';
import Link from 'next/link';

export default function HeaderLink(props) {
  const router = useRouter();
  const { columnKey, linkText } = props;
  const { sort, dir } = router.query;
  const classDir = dir === 'asc' ? 'asc' : 'desc';
  let linkDir = 'desc';
  let className = 'sort-direction';
  if (sort === columnKey) {
    linkDir = dir === 'desc' ? 'asc' : 'desc';
    className = `${className} ${classDir}`;
  }

  const query = {
    // Keep existing query params.
    ...router.query,
    // Override ones related to sort.
    dir: linkDir,
    sort: columnKey,
  };

  return (
    <Link
      href={{ pathname: router.pathname, query }}
      passHref
      className={className}>
      {linkText}
    </Link>
  );
}
