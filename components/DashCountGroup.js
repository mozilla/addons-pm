import React from 'react';
import { Card } from 'react-bootstrap';

export default function DashCountGroup(props) {
  return (
    <div
      className={props.className ? `card-grp ${props.className}` : 'card-grp'}
      key={props.key}
      data-testid="dashcountgroup"
    >
      <Card bg="dark" text="white" className="title-card">
        <Card.Header data-testid="dashcountgroup-title">
          {props.title}
        </Card.Header>
        <Card.Body>
          <Card.Text data-testid="dashcountgroup-desc">
            {props.description}
          </Card.Text>
        </Card.Body>
      </Card>
      {props.children}
    </div>
  );
}
