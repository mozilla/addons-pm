## Add-ons Project Manager

[![Build Status](https://travis-ci.org/mozilla/addons-pm.svg?branch=master)](https://travis-ci.org/mozilla/addons-pm) [![codecov](https://codecov.io/gh/mozilla/addons-pm/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/addons-pm)

This app is a view on the org level projects specific to add-ons.

## Development

- Uses node 10.x
- Uses yarn

### Installation and start-up

- `yarn install`
- `yarn start`

`yarn start` uses stmux to start the various services and show their output on one screen. `ctrl + a ?` will show a help dialogue. Use `ctrl + a k` to quit.

### API Token

For the server to be able to make requests you'll need to either expose an `GH_TOKEN` env var or create a `.env` file in the root your checkout (`.env` files are .gitignored by default): 

```yaml
GH_TOKEN=SECRET_TOKEN
```

You can generate a token here: https://github.com/settings/tokens and you'll need the following scopes:

```
public_repo, read:org 
```
