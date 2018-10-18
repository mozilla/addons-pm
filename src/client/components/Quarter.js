import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const today = new Date();
let currentYear = today.getFullYear();
let currentQuarter = Math.floor((today.getMonth() + 3) / 3);

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export function Quarter(props) {
  if (!/\d{4}/.test(props.year)) {
    throw new Error('Invalid year');
  }

  currentYear = props.currentYear || currentYear;
  currentQuarter = props.currentQuarter || currentQuarter;
  const activeYear = parseInt(currentYear, 10) === parseInt(props.year, 10);

  return (
    <React.Fragment>
      <h3 className={classNames({ "active-year": activeYear })}>{props.year}</h3>
      <ul>
        {
          quarters.map((quarter) => {
            const classes = classNames({ "active-date": (`Q${currentQuarter}` === quarter && activeYear === true)});
            return <li key={`${props.year}-${quarter}`}><Link className={classes} to={`/${props.year}/${quarter}/primary/`}>{quarter}</Link></li>
          })
        }
      </ul>
    </React.Fragment>
  );
}
