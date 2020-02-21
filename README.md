# Ninjathon⚡👓

The all-in-one DataHack management platform, from registration to communications and voting!

## Running the development environment
1. Setup the project by running `./scripts/setup`
2. Migrate the database schemas by running `./scripts/migration apply latest`
3. If you want to populate the database then run `./scripts/backup restore lastest`

> *Note:* if you want to populate the database from a different version/file run `./scripts/backup restore <file path>`

## Deploying the project

> *Note:* This step is intended to be ran on a production server!

1. Deploy project by running `./scripts/deploy`
2. Migrate the database schemas by running `./scripts/migration apply latest`
3. Wait for backups to be pulled from AWS automatically
4. Populate the database by running `./scripts/backup restore lastest`

## Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the GPL-3 License - see the [LICENSE](LICENSE.md) file for details
