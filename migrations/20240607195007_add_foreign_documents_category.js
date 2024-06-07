
exports.up = function(knex) {
  return knex.schema.table('document_category', (table) => {
      table.foreign('document_id').references('documents.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('category_id').references('categories.id').onDelete('CASCADE').onUpdate('CASCADE')
  })
};


exports.down = function(knex) {
    return knex.schema.table('document_category', (table) => {
        table.dropForeign('document_id')
        table.dropForeign('category_id')
    })
};
