import React from 'react';
import { withRouter } from 'react-router-dom';

import { Breadcrumb } from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

export function BreadcrumbNav(props) {
  const currentPath = props.location && props.location.pathname;
  const { year, quarter, projectType, engineer } =
    (props.match && props.match.params) || {};
  const yearUrl = `/${year}/`;
  const quarterUrl = `/${year}/${quarter}/`;
  const projectTypeUrl = `/${year}/${quarter}/${projectType}/`;
  const engineerUrl = `/${year}/${quarter}/${engineer}/`;

  return (
    <Breadcrumb>
      <LinkContainer to="/">
        <Breadcrumb.Item active={currentPath === '/'}>Home</Breadcrumb.Item>
      </LinkContainer>
      {year ? (
        <LinkContainer to={year ? yearUrl : null}>
          <Breadcrumb.Item active={currentPath === yearUrl}>
            {year}
          </Breadcrumb.Item>
        </LinkContainer>
      ) : null}
      {quarter ? (
        <LinkContainer to={quarter ? quarterUrl : null}>
          <Breadcrumb.Item active={currentPath === quarterUrl}>
            {quarter}
          </Breadcrumb.Item>
        </LinkContainer>
      ) : null}
      {engineer ? (
        <LinkContainer to={quarter ? engineerUrl : null}>
          <Breadcrumb.Item active={currentPath === engineerUrl}>
            {engineer}
          </Breadcrumb.Item>
        </LinkContainer>
      ) : null}
      {projectType ? (
        <LinkContainer to={quarter ? projectTypeUrl : null}>
          <Breadcrumb.Item active={currentPath === projectTypeUrl}>
            {projectType}
          </Breadcrumb.Item>
        </LinkContainer>
      ) : null}
    </Breadcrumb>
  );
}

export default withRouter(BreadcrumbNav);
