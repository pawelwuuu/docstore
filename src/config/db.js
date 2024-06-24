const knex = require('knex');
const knexConfig = require('../../knexfile');


let env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env.trim()]);

module.exports = db