import Link from 'next/link';
import { Image } from 'react-bootstrap';

export default function Engineer(props) {
  const { member, year, quarter } = props;
  return (
    <Link
      href={`/projects/${year}/${quarter}/?engineer=${encodeURIComponent(
        member.login.toLowerCase(),
      )}`}
    legacyBehavior>
    <a>
      <Image
        src={member.avatarUrl}
        title={member.login}
        alt={member.login}
        roundedCircle
        className="float-end eng-image"
        height="35"
      />
    </a>
    </Link>
  );
}
