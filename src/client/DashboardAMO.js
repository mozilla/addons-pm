import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

import Client from './Client';
import AMODashCountGroup from './components/AMODashCountGroup';

import './Dashboard.scss';

class DashboardAMO extends Component {
  state = {
    issueCounts: {
      data: null,
    },
  };

  async getIssueCounts() {
    return await Client.getGithubIssueCounts();
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
        <AMODashCountGroup
          key={repo + index}
          issueCounts={issueCountData[repo]}
          description={issueCountData[repo].description}
          repo={repo}
        />,
      );
    });
    return countGroups;
  }

  render() {
    const issueCounts = this.state.issueCounts;

    return (
      <div className="dashboard">
        <Helmet>
          <body className="dash" />
          <title>AMO Dashboard</title>
        </Helmet>
        <Container as="main">
          <div className="dash-container">
            {issueCounts.data === null ? (
              <div className="loading">
                <p>Loading...</p>
              </div>
            ) : (
              this.renderCounts()
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default DashboardAMO;
