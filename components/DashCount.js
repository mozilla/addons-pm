import classNames from 'classnames';
import { Card } from 'react-bootstrap';

export default function DashCount(props) {
  let extraTitle = '';
  if (typeof props.warningLimit !== 'undefined') {
    extraTitle = ` (Warning Threshold: count >= ${props.warningLimit})`;
  }

  return (
    <Card
      bg="dark"
      text="white"
      as="a"
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      title={`${props.title}${extraTitle}`}
    >
      <Card.Header>{props.title.toUpperCase()}</Card.Header>
      <Card.Body>
        <div
          data-testid="dashcount-svg-wrapper"
          className={classNames({
            outer: true,
            warning:
              typeof props.warningLimit !== 'undefined' &&
              props.count >= props.warningLimit,
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
