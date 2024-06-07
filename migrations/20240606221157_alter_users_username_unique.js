
exports.up = function(knex) {
    return knex.schema.table('users', (table) => {
        table.string('username').unique().alter()
    })
};


exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropUnique('email');
    });
};
