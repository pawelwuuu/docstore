exports.up = function(knex) {
    return knex.schema.createTable('documents', function(table) {
        table.increments('id').primary();
        table.integer('user_id').notNullable()
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.string('author').notNullable();
        table.string('filename').notNullable()
        table.date('uploaded_at').notNullable().defaultTo(knex.fn.now());

        // table.foreign('user_id').references('id').inTable('users')
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('documents');
};
