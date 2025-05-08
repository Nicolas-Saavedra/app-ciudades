# App Ciudades

The following application was a technical test. To be able to run the application, we recommend
using docker compose, with the following steps

First, create an env file named `.env`. There is an example `.env.example` in the repository on how
to create one. Recommended to use `openssl rand -hex 64` to create secure keys. The host can use the network
name from the compose instead of localhost, but beware that this will screw with drizzle-kit's database location

```
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=database # Change this to localhost or the database host when running drizzle-kit push/migrate
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

JWT_SECRET_ACCESS_KEY=secret-key-please-generate-this-securely
JWT_SECRET_REFRESH_KEY=secret-key-please-generate-this-securely-as-well

PASSWORD_SALT=secret-key-please-generate-this-securely-as-well-as-well
```

Afterwards, follow the CLI steps down below

```
docker compose up -d        # Starts the application

# Modify .env here to point to localhost now instead

yarn         # Necessary to run drizzle-kit migrations

npx drizzle-kit push         # Adds table schema
npx drizzle-kit migrate         # Adds extension support for PostGIS

psql -h localhost -U postgres -f data/testing-data.sql       # Adds testing data for non-user tables

```

Then open http://localhost:3000/docs for OpenAPI documentation

_Disclaimer:_ During these processes, commands such as migration commands are recommended to be part of the
build pipeline. However, due to the manner drizzle manages migrations, running them in the docker image
phase was difficult in the time frame provided. It is understood that changing the .env mid-deployment
is not ideal. However, instructions have been provided so a working product can be shown

## Tests

```
yarn
yarn test
```

Tests have been performed using a postgres instance live, there is no mocks running for the tests. This
does mean that it's mandatory for postgres to be running for tests to work. Migrations are also necessary
for the tests to work properly. Tests read from the `.env` file for database location information

### Footnote:

Credits to the World data used for the activity go to https://simplemaps.com/data/world-cities.

The data used from this page was modified to adjust to the requirements.
