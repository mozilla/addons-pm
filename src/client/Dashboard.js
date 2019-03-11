import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

import Client from './Client';
import DashCountGroup from './components/DashCountGroup';

import './Dashboard.scss';

class Dashboard extends Component {
  state = {
    issueCounts: {
      data: null,
    },
  };

  async getIssueCounts() {
    return await Client.getIssueCounts();
  }

  async componentDidMount() {
    const issueCounts = await this.getIssueCounts();
    this.setState({
      issueCounts: issueCounts,
    });
  }

  renderCounts() {
    const issueCountData = this.state.issueCounts.data;
    const countGroups = [];
    Object.keys(issueCountData).forEach((repo, index) => {
      countGroups.push(
        DashCountGroup({
          issueCounts: issueCountData[repo],
          description: issueCountData[repo].description,
          repo,
        }),
      );
    });
    return countGroups;
  }

  render() {
    const issueCounts = this.state.issueCounts;

    return (
      <div className="dashboard">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <Container as="main">
          <div className="dash-container">
            {issueCounts.data === null ? (
              <p>Loading...</p>
            ) : (
              this.renderCounts()
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
