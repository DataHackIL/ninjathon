# Ninjathon⚡👓
[![Build Status](https://travis-ci.org/DataHackIL/ninjathon.svg?branch=master)](https://travis-ci.org/DataHackIL/ninjathon)[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f1cd12b3745b45b981848ab96736c317)](https://www.codacy.com/app/shaked-lokits/ninjathon?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DataHackIL/ninjathon&amp;utm_campaign=Badge_Grade)[![Dependency Status](https://david-dm.org/DataHackIL/ninjathon.svg)](https://david-dm.org/DataHackIL/ninjathons)[![devDependency Status](https://david-dm.org/DataHackIL/ninjathon/dev-status.svg)](https://david-dm.org/DataHackIL/ninjathon#info=devDependencies)[![Coverage Status](https://coveralls.io/repos/github/DataHackIL/ninjathon/badge.svg?branch=master)](https://coveralls.io/github/DataHackIL/ninjathon?branch=master)

The all-in-one hackathon management platform, from registration to communications and voting!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to run Ninjathon, you must install [horizon.io](http://horizon.io/), the real-time database. For more information, see [Installing Horizon](http://horizon.io/install/).

> Note: Project was tested on macOS Sierra, RHEL 7, Fedora 23 and CentOS 7 ✨

### Running Development Environment

In order to run the development environment simply install [horizon.io](http://horizon.io/) as introduced in the previous chapter and run the following commands.

```shell
yarn # will install project dependencies; run once
yarn start-dev # will launch and dev-server
```
> Note: The development server will watch for changes and hot-reload as required ✨

But if you want to statically build the client for development purposes, you can manually run:
```shell
yarn build
```
which will generate the requested `/dist` folder

## Running the tests

In order to run the tests, simply run:

```shell
yarn test
```

> Note: We are supporting both unit, functional and integration tests ✨

### Tests Structure

Each component is joined with a `\*.test.js` file which **at least** passes a smoke test on it's render function and **additionally** verifies custom functionality it performs(component life-cycle functions)

For example, App.js holds the app root point(surprisingly😏)
```
.
├── App.js
└── App.test.js
```
Thus App.test.js will hold a test suite the App component
```javascript
import React from 'react'
import App from './App'

describe('App', function() {
    it('smoke test', function() {
      let app = shallow(<App/>)
			expect(app).to.not.be.null
    })
})
```

### Tests Configuration

We are using [Mocha](https://mochajs.org/) as our test runner and [Chai](http://chaijs.com/) for assertions as well as [Enzyme](http://airbnb.io/enzyme/) for shallow rendering, [Sinon](http://sinonjs.org/) for mocking and [Istanbul](https://istanbul.js.org/) for coverage. By running `yarn test`, all `*.test.js` files will be ran on a shallow VDOM against the DB and results reported to the command-line.

```shell
yarn test v0.27.5
$ concurrently ... --recursive \"src/**/*.test.js\" test\" # test command
[0] App available at http://127.0.0.1:8181
[0] info: RethinkDB Running rethinkdb 2.3.6 (CLANG 8.1.0 (clang-802.0.42))...
[0] info: RethinkDB Running on Darwin 16.6.0 x86_64
... # loading rethinkdb / horizon server
[0] debug: Connection to RethinkDB established.
[0] debug: checking rethinkdb version
[0] debug: checking for internal tables
... # building project
[1]  WEBPACK  Compiling...
[1]
[1]  WEBPACK  Compiled successfully in 622ms
[1]
... # starting tests
[1]  MOCHA  Testing...
[1]
[1]
[1]
[1]   App
[1]     ✓ smoke test
[1]
[1]   TestComponent
[1]     ✓ smoke test
[1]
[1]
[1]   2 passing (11ms)
[1]
[1]  MOCHA  Tests completed successfully
```

## Code Structure

The code is structured such that components are loaded from separate folders as designed by [SurviveJS](https://survivejs.com/react/advanced-techniques/structuring-react-projects/).

```
.
├── src
│   ├── components - ReactJS presentational components
│   │   └── ReactComponent - component folder
│   │       ├── ReactComponent.js - component source
│   │       ├── ReactComponent.sass - component sass style
│   │       └── ReactComponent.test.js - component tests
│   ├── containers - ReactJS container components (same structure)
│   ├── logic - non-database services logic (e.g mail service)
│   ├── App.js - ReactJS root component
│   ├── App.test.js
│   ├── index.ejs - autogeneration view template
│   └── index.js - entry point
├── ... README and licences
└── ... configuration files
```

## Database Access

We are using  [horizon.io](http://horizon.io/) server together with the [react-horizon Provider](https://github.com/roman01la/react-horizon) to allow binded SocketIO communication with horizon. See [react-horizon](https://github.com/roman01la/react-horizon) for more information.

## Deployment

In order to deploy, simply run:
```shell
yarn
yarn deploy
```

## Built With

* [React](https://facebook.github.io/react/) - web framework
* [react-router](https://github.com/ReactTraining/react-router) - URL routing and scene navigation
* [react-horizon](https://github.com/roman01la/react-horizon) - Horizon.io database binding
* [Horizon.io](http://horizon.io/) - database(built on RethinkDB)
* [Webpack 2.0](https://webpack.js.org/) - bundling, pre-processing and transpilation
* [Mocha](https://mochajs.org/) - test runner
* [Enzyme](http://airbnb.io/enzyme/index.html) - react component rendering
* [Chai](http://chaijs.com/) - assertions
* [Sinon](http://sinonjs.org/) - mocking
* [Istanbul](https://istanbul.js.org/) - coverage reporter

## Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Shilo Mangam** - *Original Maintainer and Initial Work* - [shilomangam](https://github.com/shilomangam)
* **Shaked Lokits** - *Current Maintainer* - [shakedlokits](https://github.com/shakedlokits)
* **Tomer Omri** - *Original Contributor* - [tomz](https://github.com/TomerOmri)
* **Eden Swissa** - *Original Contributor* - [edenswi67](edenswi67@gmail.com)
* **Dany Shaanan** - *Contributor* - [danyshaanan](https://github.com/danyshaanan)

## License

This project is licensed under the GPL-3 License - see the [LICENSE](LICENSE.md) file for details

## Acknowledgments

This project inspired by [HUJI Hackathon Registration Platform](https://github.com/amirc/huji-hackathon-registration) originally coded by [Oded Valtzer](https://github.com/ovaltzer)
