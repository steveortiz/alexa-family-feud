[![Build Status](https://travis-ci.org/steveortiz/alexa-family-feud.svg?branch=master)](https://travis-ci.org/steveortiz/alexa-family-feud)

# Family Feud Skill for Alexa

## Setup

Assuming you already have an AWS account and an Alexa developer account.

If you don't already have node installed:

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
source ~/.bashrc # or start a new terminal session
command -v nvm # to verify nvm was setup
nvm install v4.3.2
nvm alias default v4.3.2
```

Create the following:
* In AWS, a lambda function named FamilyFeud in us-east-1
* Alexa Skill to call the lambda function

Install [aws-cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)

Configure credentials to update the lambda function.  You can use the following command
to change profiles if desired:

```sh
export AWS_DEFAULT_PROFILE=profile
```

## Developing

Run `npm install` as part of setup and any time dependencies are added.

To build and upload the skill, run `npm start`

To cleanup the dist directory, run `npm run clean`
