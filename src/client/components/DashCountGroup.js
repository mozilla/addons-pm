import React from 'react';
import { Card } from 'react-bootstrap';

export default function DashCountGroup(props) {
  return (
    <div className="card-grp" key={props.key}>
      <Card bg="dark" text="white" className="repo-card">
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>
          <Card.Text>{props.description}</Card.Text>
        </Card.Body>
      </Card>
      {props.children}
    </div>
  );
}
