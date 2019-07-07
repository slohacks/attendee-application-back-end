# SLO Hacks Attendee Application Back End 2019

**Welcome!** This document will give you an overview of the technology behind this project and show you how you can contribute.

## Tech Stack 

The tools that we're using in this project.

- [Express](https://expressjs.com/en/starter/installing.html)
    - [Morgan](https://github.com/expressjs/morgan)
    - [Multer](https://github.com/expressjs/multer)
- [MongoDB](http://mongodb.github.io/node-mongodb-native/3.1/api/index.html)
    - [Mongoose](https://mongoosejs.com/docs/guide.html)
- [PassportJS](http://www.passportjs.org/docs/)
- [BcryptJS](https://www.npmjs.com/package/bcrypt)
- [Sendgrid](https://sendgrid.com/docs/api-reference/)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Validator](https://www.npmjs.com/package/validator)
- [Lodash](https://lodash.com/docs/4.17.11)

## Getting Started (Workflow)

1. Fork the repository and clone it to your machine.
2. Point your fork to the main repo by doing `git remote add upstream https://github.com/slohacks/attendee-application-back-end`
2. Install the global dependencies in this project: `commitizen`.\
 \- e.g `yarn global add commitizen`
3. After installing the global dependencies, then you can install the project dependencies by running `yarn` or `yarn install` in the root of the folder.
4. Before beginning to develop, you will need to add a MongoDB URL to `src/db/mongoose.js` to allow `Express` to connect to your database.
5. Use the following commands as needed:
    - To start up a development server: `yarn run dev`.
    - To lint your code: `yarn run lint`.
6. Create a pull request on [attendee-application-back-end](https://github.com/slohacks/attendee-application-back-end/pulls) against your fork
7. Address any changes requested by maintainers 
    - After merging your pull request, `git pull upstream master` on your master branch and create a new branch for a new feature.

## Standards

To contribute to this project, you must conform to the following standards.

### Code 
- _Required_: Javascript Style Guide
    - [StandardJS](https://standardjs.com/rules.html)
        - When you make a pull request, your code will be checked against StandardJS and will be marked green or red.
        - Pull requests that do not conform to StandardJS will not be accepted.

### Commits & Pull Requests
- _Required_: use [commitizen](https://github.com/commitizen/cz-cli) through `git cz` when commiting.
    - Our repository is preconfigured to be commitizen-friendly
    - Commits that do not conform to the `conventional-changelog` standard will not be accepted
