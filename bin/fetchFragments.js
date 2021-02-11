const path = require('path');
const fs = require('fs');

const fetch = require('node-fetch');
const { loadEnvConfig } = require('@next/env');

// Require env variables.
const dev = process.env.NODE_ENV !== 'production';
loadEnvConfig(path.join(__dirname, '../'), dev);

const headers = { 'Content-Type': 'application/json' };

if (process.env.GH_TOKEN) {
  headers.Authorization = `token ${process.env.GH_TOKEN}`;
} else {
  throw new Error('No GH_TOKEN found');
}

fetch(`https://api.github.com/graphql`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null,
    );
    result.data.__schema.types = filteredData;
    fs.writeFile(
      path.join(__dirname, '../lib/fragmentTypes.json'),
      JSON.stringify(result.data),
      (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('Error writing fragmentTypes file', err);
        } else {
          // eslint-disable-next-line no-console
          console.log('Fragment types successfully extracted!');
        }
      },
    );
  });
