const db = require('../config/db');

const checkDbConnection = async (req,res,next) => {
    try {
        await db.raw('SELECT 1');
        next();
    } catch (e) {
        e.userMsg = "Nasz serwis jest akutualnie niedostępny z przyczyn technicznych, przepraszamy."
        next(e);
    }
}

module.exports = checkDbConnection