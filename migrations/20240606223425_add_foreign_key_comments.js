exports.up = async function(knex) {
    await knex.schema.table('comments', function(table) {
        table.integer('user_id').notNullable().unsigned().alter();
        table.integer('document_id').notNullable().unsigned().alter();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
        table.foreign('document_id').references('id').inTable('documents').onDelete('CASCADE').onUpdate('CASCADE');
    });


};

exports.down = function(knex) {
    return knex.schema.table('comments', function(table) {
        table.dropForeign('user_id');
        table.dropForeign('document_id');
    });
};
