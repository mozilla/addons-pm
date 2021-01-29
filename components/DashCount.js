import React from 'react';
import classNames from 'classnames';
import { Card } from 'react-bootstrap';

export default function DashCount(props) {
  return (
    <Card
      bg="dark"
      text="white"
      as="a"
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card.Header>{props.title.toUpperCase()}</Card.Header>
      <Card.Body>
        <div
          data-testid="dashcount-svg-wrapper"
          className={classNames({
            outer: true,
            warning: props.warning,
            total: props.title.includes('total open'),
          })}
        >
          <svg preserveAspectRatio="xMinYMin meet">
            <g>
              <circle r="30%" cx="50%" cy="50%" className="circle-back" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy="0.3em"
                data-testid="dashcount-count"
              >
                {props.count}
              </text>
            </g>
          </svg>
        </div>
      </Card.Body>
    </Card>
  );
}
