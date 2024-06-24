const knex = require('knex')
const knexConfig = require("../knexfile");
let env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env.trim()]);

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
