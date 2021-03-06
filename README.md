# Ninjathon⚡👓

The all-in-one DataHack management platform, from registration to communications and voting!

## Running the development environment
1. Setup the project by running `./scripts/setup`
2. boot containers `docker-compose up`
3. Migrate the database schemas by running `./scripts/migration apply latest`
4. If you want to populate the database then run `./scripts/backup restore lastest`

> *Note:* if you want to populate the database from a different version/file run `./scripts/backup restore <file path>`

## Deploying the project

> *Note:* This step is intended to be ran on a production server!

1. Deploy project by running `./scripts/deploy`
2. Migrate the database schemas by running `./scripts/migration apply latest`
3. Wait for backups to be pulled from AWS automatically
4. Populate the database by running `./scripts/backup restore lastest`

## Testing

To test the project we use [Cypress](https://www.cypress.io/) running through docker and X11 rendering server.

- In order to run the tests through CLI run `./scripts test cli`
- If you want to run the tests interactively you should run `./scripts test gui`

> *Note:* On macOS and Windows, and X11 server will be required, [XQuartz](https://www.xquartz.org/) is the standard X11 server for macOS and you will need to tick the [Allow connections from network clients](https://blogs.oracle.com/oraclewebcentersuite/running-gui-applications-on-native-docker-containers-for-mac) and restart Quartz.

## Linting

In order to lint the project for code quality issues you could either run `./scripts/lint status` to view files that are conflicting with the code style or run `./scripts/lint fix` to resolve the conflicts automatically.

## Common Issues

- On macOS, if you get the error `realpath: command not found` then you should install coreutils which could be installed through brew by running `brew install coreutils`
- Hasura fails to start. Run `docker-compose restart hasura`.

### hasura migration issues
If step 3 (Migrate the database schemas by running `./scripts/migration apply latest`) fails. Try the following:
- Make sure containers are up. `docker-compose up`
- open a new terminal and run. `docker exec -it hasura sh`
- go to hasura-migrations. `cd hasura-migrations`
- Copy the last printed version number (e.g. 1582141486977).
- Run `hasura-cli migrate apply --version 1582141486977`

You're all set.


## Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the GPL-3 License - see the [LICENSE](LICENSE.md) file for details
