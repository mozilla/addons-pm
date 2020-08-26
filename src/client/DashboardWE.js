/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import useSWR from 'swr';

import { API_ROOT } from '../const';
import Client from './Client';
import DashCount from './components/DashCount';
import DashCountGroup from './components/DashCountGroup';

import './Dashboard.scss';


const meta = {
  Toolkit: {
    title: 'Addons Manager Bugs',
    description: 'Addons Manager related code',
  },
  WebExtensions: {
    title: 'Web Extensions Bugs',
    description: 'Browser APIs for Webextensions',
  },
  Firefox: {
    title: 'Web Extensions Compat Bugs',
    description: 'Compat bugs Webextensions',
  },
};


function DashboardWE() {
  function getIssueCounts() {
    const { data, error } = useSWR(`${API_ROOT}/bugzilla-issues-counts/`, async () => {
      return await Client.getBugzillaIssueCounts();
    }, { refreshInterval: 30000 });
    return {
      data,
      isLoading: !error && !data,
      isError: error
    };
  }

  function getNeedInfos() {
    const { data, error } = useSWR(`${API_ROOT}/bugzilla-need-infos/`, async () => {
      return await Client.getBugzillaNeedInfos();
    });
    return {
      data,
      isLoading: !error && !data,
      isError: error
    };
  }

  const needInfos = getNeedInfos();
  const issueCounts = getIssueCounts();

  function renderChild({ data, dataKey, component, title, warningLimit }) {
    const { count, url } = data[dataKey];
    return (
      <DashCount
        count={count}
        key={component + title}
        title={title}
        warning={warningLimit && count >= warningLimit}
        link={url}
      />
    );
  }

  function renderChildren(component, data) {
    const nodes = [];
    nodes.push(
      renderChild({
        data,
        dataKey: 'total',
        title: 'total open',
        warningLimit: null,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'severity-default',
        title: 'Untriaged',
        warningLimit: 15,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'severity-s1',
        title: 'S1',
        warningLimit: 1,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'severity-s2',
        title: 'S2',
        warningLimit: 10,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'priority-p1',
        title: 'P1',
        warningLimit: 10,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'priority-p2',
        title: 'P2',
        warningLimit: 20,
        component,
      }),
    );
    nodes.push(
      renderChild({
        data,
        dataKey: 'priority-p3',
        title: 'P3',
        warningLimit: null,
        component,
      }),
    );
    return nodes;
  }

  function renderCounts() {
    if (!issueCounts.data) {
      return null;
    }
    const countGroups = [];
    Object.keys(issueCounts.data).forEach((component, index) => {
      if (meta.hasOwnProperty(component)) {
        countGroups.push(
          DashCountGroup({
            key: index + meta[component].title,
            children: renderChildren(
              component,
              issueCounts.data[component],
            ),
            title: meta[component].title,
            description: meta[component].description,
          }),
        );
      } else {
        console.log(`countGroup "${component}: added without meta`);
      }
    });
    return countGroups;
  }

  function renderNeedInfos() {
    const children = [];
    Object.keys(needInfos.data).forEach((nick, index) => {
      children.push(
        renderChild({
          data: needInfos.data,
          dataKey: nick,
          component: nick,
          title: nick,
          warningLimit: 5,
        }),
      );
    });

    return DashCountGroup({
      className: 'needinfos',
      key: 'needinfos',
      children,
      title: 'Need Infos',
      description: 'Count of need info requests',
    });
  }

  let isLoading = false;
  if (needInfos.isLoading || issueCounts.isLoading) {
    isLoading = true;
  }

  return (
    <div className="dashboard">
      <Helmet>
        <body className="dash" />
        <title>Webextension Dashboard</title>
      </Helmet>
      <Container as="main">
        <div className="dash-container">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            [renderNeedInfos(), ...renderCounts()]
          )}
        </div>
      </Container>
    </div>
  );
}

export default DashboardWE;
