import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import useSWR from 'swr';
import { API_ROOT } from 'lib/const';
import DashCount from 'components/DashCount';
import DashCountGroup from 'components/DashCountGroup';

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

const issueCountURL = `${API_ROOT}/bz-issue-counts/`;
const needInfoURL = `${API_ROOT}/bz-need-infos/`;

export async function getServerSideProps() {
  const [issueCountsResponse, needInfosResponse] = await Promise.all([
    fetch(issueCountURL),
    fetch(needInfoURL),
  ]);

  const issueCounts = await issueCountsResponse.json();
  const needInfos = await needInfosResponse.json();

  return {
    props: {
      issueCounts,
      needInfos,
    },
  };
}

function DashboardWE(props) {
  function getIssueCounts() {
    const { data, error } = useSWR(
      issueCountURL,
      async () => {
        const result = await fetch(issueCountURL);
        return result.json();
      },
      { refreshInterval: 30000, initialData: props.issueCounts },
    );
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  }

  function getNeedInfos() {
    const { data, error } = useSWR(
      needInfoURL,
      async () => {
        const result = await fetch(needInfoURL);
        return result.json();
      },
      { refreshInterval: 90000, initialData: props.needInfos },
    );
    return {
      data,
      isLoading: !error && !data,
      isError: error,
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
      if (Object.prototype.hasOwnProperty.call(meta, component)) {
        countGroups.push(
          DashCountGroup({
            key: index + meta[component].title,
            children: renderChildren(component, issueCounts.data[component]),
            title: meta[component].title,
            description: meta[component].description,
          }),
        );
      } else {
        // eslint-disable-next-line no-console
        console.debug(`countGroup "${component}: added without meta`);
      }
    });
    return countGroups;
  }

  function renderNeedInfos() {
    const children = [];
    Object.keys(needInfos.data).forEach((nick) => {
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
        <title>Webextension Dashboard</title>
        <body className="dash" />
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
