# Blog

## Dependencies
######Preprocessors

    CoffeeScript
    Stylus

## Setting Up Environments

######Initial
`heroku plugins:install git://github.com/ddollar/heroku-config.git`


Create a folder for your .env files - ex: `development.env`

#### Example of key/value pairs
    KEY=value

##### Environments can be pushed to a heroku app with
* run `heroenvy <ENV FILE> --app <APP>`

##### Environments can be pulled down to local (creates .env file with no prefix in root directory) with
* run `heroku config:pull --app <APP>`