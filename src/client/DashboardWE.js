import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

import Client from './Client';
import DashCount from './components/DashCount';
import DashCountGroup from './components/DashCountGroup';

import './Dashboard.scss';
import './DashboardWE.scss';

class DashboardWE extends Component {
  state = {
    issueCounts: null,
    needInfos: null,
  };

  async getIssueCounts() {
    return await Client.getBugzillaIssueCounts();
  }

  async getNeedInfos() {
    return await Client.getBugzillaNeedInfos();
  }

  async componentDidMount() {
    const [issueCounts, needInfos] = await Promise.all([
      this.getIssueCounts(),
      this.getNeedInfos(),
    ]);

    this.setState({
      issueCounts,
      needInfos,
    });
  }

  meta = {
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

  renderChild({ data, dataKey, component, title, warningLimit }) {
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

  renderChildren(component, data) {
    const nodes = [];
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'total',
        title: 'total open',
        warningLimit: null,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'severity-default',
        title: 'Untriaged',
        warningLimit: 15,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'severity-s1',
        title: 'S1',
        warningLimit: 1,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'severity-s2',
        title: 'S2',
        warningLimit: 10,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'priority-p1',
        title: 'P1',
        warningLimit: 10,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'priority-p2',
        title: 'P2',
        warningLimit: 20,
        component,
      }),
    );
    nodes.push(
      this.renderChild({
        data,
        dataKey: 'priority-p3',
        title: 'P3',
        warningLimit: null,
        component,
      }),
    );
    return nodes;
  }

  renderCounts() {
    const countGroups = [];
    Object.keys(this.state.issueCounts).forEach((component, index) => {
      if (this.meta.hasOwnProperty(component)) {
        countGroups.push(
          DashCountGroup({
            key: index + this.meta[component].title,
            children: this.renderChildren(
              component,
              this.state.issueCounts[component],
            ),
            title: this.meta[component].title,
            description: this.meta[component].description,
          }),
        );
      } else {
        console.log(`countGroup "${component}: added without meta`);
      }
    });
    return countGroups;
  }

  renderNeedInfos() {
    const children = [];
    const data = this.state.needInfos;
    Object.keys(this.state.needInfos).forEach((nick, index) => {
      children.push(
        this.renderChild({
          data,
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

  render() {
    const { issueCounts, needInfos } = this.state;

    return (
      <div className="dashboard">
        <Helmet>
          <body className="dash" />
          <title>Webextension Dashboard</title>
        </Helmet>
        <Container as="main">
          <div className="dash-container">
            {issueCounts === null || needInfos === null ? (
              <div className="loading">Loading...</div>
            ) : (
              [this.renderNeedInfos(), ...this.renderCounts()]
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default DashboardWE;
