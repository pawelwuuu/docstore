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
        table.date('uploaded_at').alter()
    })
};
