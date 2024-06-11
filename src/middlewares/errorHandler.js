const fileOperations = require('../utils/fileOperations')
const serverStartStamp = require('../utils/serverStartStamp');

const errorHandler = async (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Wystąpił błąd.";

    if (process.env.LOG_ERROR_TO_FILE === '1') {
        await fileOperations.appendToFile(
            `${error.statusCode} ${new Date(Date.now()).toString()}\n${error.stack}\n\n`,
            `error_logs/${serverStartStamp}.txt`)
    }
    if (process.env.LOG_TO_CONSOLE === '1') {
        console.log(error)
    }


    if (req.path === /\/api.*/) {
        res.status(error.statusCode).send("Wystąpił błąd.");
    } else {
        res.status(error.statusCode).render('error', {err: error});
    }

    next();
}

module.exports = errorHandler;