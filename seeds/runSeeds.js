const knex = require('knex')
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

async function runSeeds() {
    try {
        await db.seed.run({
            directory: './',
            specific: 'users.js'
        });

        await db.seed.run({
            directory: './',
            specific: 'documents.js'
        });

        await db.seed.run({
            directory: './',
            specific: 'comments.js'
        });

        await db.seed.run({
            directory: './',
            specific: 'categories.js'
        });

        await db.seed.run({
            directory: './',
            specific: 'document_category.js'
        });
    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        await db.destroy();
    }
}

runSeeds();
