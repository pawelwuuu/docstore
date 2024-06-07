const faker = require('faker');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
      .then(function () {
        // Inserts seed entries
        const comments = [];
        for (let i = 0; i < 10; i++) {
          comments.push({
            user_id: faker.datatype.number({min: 1, max: 10}),
            document_id: faker.datatype.number({min: 1, max: 10}),
            content: faker.lorem.paragraph(),
          });
        }
        return knex('comments').insert(comments);
      });
};
