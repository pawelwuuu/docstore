const faker = require('faker');

exports.seed = function(knex) {
  return knex('documents').del()
      .then(function () {

        const documents = [];
        for (let i = 0; i < 50; i++) {
          documents.push({
              id: i+1,
            user_id: faker.datatype.number({min: 1, max: 10}),
            title: faker.lorem.words(),
            description: faker.lorem.sentence(),
            author: faker.name.findName(),
            filename: faker.system.fileName(),
            uploaded_at: faker.date.past(),
              file_ext: 'pdf'
          });
        }

        documents.push({
            id: 1001,
            user_id: 999,
            title: 'test',
            description: 'test',
            author: 'test',
            filename: faker.system.fileName(),
            uploaded_at: faker.date.past()
        },{
            id: 1002,
            user_id: 1000,
            title: 'comment_test',
            description: 'test',
            author: 'test',
            filename: faker.system.fileName(),
            uploaded_at: faker.date.past()
        })

        return knex('documents').insert(documents);
      });
};
