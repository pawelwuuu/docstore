/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
    },
  }
  ,
  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'docstore_test',
      pool: {
        min: 2,    // minimalna liczba połączeń w puli
        max: 10    // maksymalna liczba połączeń w puli
      },
      acquireConnectionTimeout: 10000
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
