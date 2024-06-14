exports.up = async function(knex) {
    await knex.schema.table('documents', function(table) {
        table.integer('user_id').notNullable().unsigned().alter()
        table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
    });
};

exports.down = function(knex) {
    return knex.schema.table('documents', function(table) {
        table.dropForeign('user_id');
    });
};
