import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';

export default function Engineer(props) {
  const { member, year, quarter } = props;
  return (
    <Link to={`/${year}/${quarter}/${member.login.toLowerCase()}/`}>
      <Image
        src={member.avatarUrl}
        title={member.login}
        alt={member.login}
        roundedCircle
        className="float-right eng-image"
        height="35"
      />
    </Link>
  );
}
