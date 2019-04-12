// Magically require any env variables defined in a local .env file.
require('dotenv').config();

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const headers = { 'Content-Type': 'application/json' };

if (process.env.GH_TOKEN) {
  headers.Authorization = `token ${process.env.GH_TOKEN}`;
} else {
  throw new Error('No GH_TOKEN found');
}

fetch(`https://api.github.com/graphql`, {
  method: 'POST',
  headers: headers,
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
.then(result => result.json())
.then(result => {
  // here we're filtering out any type information unrelated to unions or interfaces
  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );
  result.data.__schema.types = filteredData;
  fs.writeFile(path.join(__dirname, '../src/server/fragmentTypes.json'), JSON.stringify(result.data), err => {
    if (err) {
      console.error('Error writing fragmentTypes file', err);
    } else {
      console.log('Fragment types successfully extracted!');
    }
  });
});
