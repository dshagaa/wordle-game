## Description

Wordle service developed with [Nest](https://github.com/nestjs/nest), [Typescript](https://www.typescriptlang.org)
and [postgreSQL](https://www.postgresql.org)

## Installation

1- Create a databas and import run the file ``public.sql``.

2- Copy and rename the file ``.env.example`` to ``.env``.

3- Configure database parameters in the ``.env`` file.

4- Run ``npm install``.

5- Import the file ``wordle-game.postman_collection.json`` to postman to test the endpoints.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
