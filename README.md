## Add-ons Project Manager

[![CircleCI](https://circleci.com/gh/mozilla/addons-pm.svg?style=svg)](https://circleci.com/gh/mozilla/addons-pm) [![codecov](https://codecov.io/gh/mozilla/addons-pm/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/addons-pm)

This app is a view on the org level projects specific to add-ons.

## Development Requirements

- Uses node LTS
- Uses yarn

### Installation and start-up

- `yarn install`
- `yarn dev`

`yarn dev` will start the Next.js development environment.

### Environment Variables

The server requires setting some required environment variables. To do this create a `.env.local` file in the root of your checkout (Note: `.env.local` files are .gitignored) and add the following:

#### GH_TOKEN

```yaml
GH_TOKEN=this-should-be-a-personal-access-token
```

You can generate a personal access token token here: https://github.com/settings/tokens and you'll need the following scopes:

```
public_repo
```

#### BZ_USERS

For needinfos to work the BZ_USERS env var should contain nicknames and Bugzilla users.

```yaml
BZ_USERS={"name": "bz-email@example.com", "name2": "bz-email@example.com"}
```

### Deployment

The current method used to deploy to Heroku is via git. To do that you'll need to setup the relevant branches and then, as long as you have rights to the apps in Heroku, you'll be able to do a release by pushing to the relevant remote repo.

Pushing to the a remote repo will start the deployment process and you'll get feedback in the terminal. For more details on this process see: https://devcenter.heroku.com/articles/git

#### Requirements

Install the [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

Add heroku git repos:

```sh
git remote add staging https://git.heroku.com/addons-pm-staging.git
git remote add production https://git.heroku.com/addons-pm.git
```

#### Pushing to stage

Double check you're on the revision you want to deploy.

```sh
heroku login
git push staging
```

#### Pushing to prod

Double check you're currently on the revision you want to deploy.

```sh
heroku login
git push production
```
