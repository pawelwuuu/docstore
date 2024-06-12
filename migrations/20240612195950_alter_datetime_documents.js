/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('documents', (table) => {
        table.datetime('uploaded_at').defaultTo(knex.fn.now(6)).alter();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('documents', (table) => {
        table.dropColumn('uploaded_at')
    })
};
