import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Nav, Navbar } from 'react-bootstrap';
import { MarkGithubIcon } from '@primer/octicons-react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <div data-testid="app-wrapper">
      <Helmet defaultTitle="Add-ons PM" titleTemplate="%s - Add-ons PM" />
      <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
          <Nav.Item>
            <Link href="/" passHref>
              <Nav.Link className="navbar-brand" eventKey={0}>
                Addons PM
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/projects/latest/" passHref>
              <Nav.Link eventKey={1}>Projects</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/milestones/latest/?dir=asc&sort=assignee" passHref>
              <Nav.Link eventKey={2}>Milestones</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/dashboards/amo/" passHref>
              <Nav.Link eventKey={3}>AMO Dashboard</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/dashboards/webext/" passHref>
              <Nav.Link eventKey={4}>Webext Dashboard</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              href="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt"
              passHref
            >
              <Nav.Link eventKey={5}>Contributions</Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>
        <Nav className="mr-sm-2">
          <Nav.Item>
            <Nav.Link
              data-ref="src"
              eventKey="src"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/mozilla/addons-pm/"
            >
              <MarkGithubIcon
                verticalAlign="middle"
                aria-label="View on Github"
                size="medium"
              />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
