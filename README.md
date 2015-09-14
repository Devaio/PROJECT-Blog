# Blog

## Setting Up Local Variables

Run `heroku plugins:install git://github.com/ddollar/heroku-config.git`

Create a folder called `env` and three files within the folder: `development.env` | `staging.env` | `live.env`

You can add variables to the `development.env` file which will be read at the local level

#### Example of variable declaration
    NODE_ENV=development

##### Variables can be pushed to a heroku app with
* run `heroenvy ENVIRONMENT.env --app APPNAME`

##### Variables can be initially pulled down to local (creates .env file with no prefix in root directory) with
* run `heroku config:pull --app APPNAME`

#### Remember!  When pulling / pushing variables, make sure you are setting NODE_ENV correctly!
