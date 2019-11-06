import React from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => (
  <div>
    <Helmet>
      <title>404 Not Found | Add-ons PM</title>
    </Helmet>
    <main className="container">
      <br />
      <h1>Page Not Found</h1>
      <p>Sorry we can't find the page you were looking for</p>
    </main>
  </div>
);
export default NotFound;
