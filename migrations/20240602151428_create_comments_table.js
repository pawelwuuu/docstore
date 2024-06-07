exports.up = function(knex) {
    return knex.schema.createTable('comments', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('document_id').unsigned().notNullable();
        table.text('content').notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comments');
};
