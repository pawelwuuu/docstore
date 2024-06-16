/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
      table.boolean('is_admin').notNullable().defaultTo(false).after('password');
      table.boolean('is_banned').notNullable().defaultTo(false).after('is_admin');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('users', (table) => {
        table.dropColumn('is_admin');
        table.dropColumn('is_banned');
    });
};
