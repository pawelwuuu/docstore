const faker = require('faker');

exports.seed = function(knex) {
  return knex('documents').del()
      .then(function () {

        const documents = [];
        for (let i = 0; i < 10; i++) {
          documents.push({
              id: i+1,
            user_id: faker.datatype.number({min: 1, max: 10}),
            title: faker.lorem.words(),
            description: faker.lorem.sentence(),
            author: faker.name.findName(),
            filename: faker.system.fileName(),
            uploaded_at: faker.date.past()
          });
        }
        return knex('documents').insert(documents);
      });
};
