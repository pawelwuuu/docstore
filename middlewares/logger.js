const fileOperations = require('../utils/fileOperations')

function formatDate() {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

const serverStartStamp = formatDate()

const logger = async (req,res,next) => {
    req.time = new Date(Date.now()).toString()

    if (process.env.LOG_TO_CONSOLE === '1') {
        console.log(req.method, req.hostname, req.path, req.time)
    }
    if (process.env.LOG_TO_FILE === '1') {

        await fileOperations.appendToFile(`${req.hostname}:${req.method} path: ${req.path} time: ${req.time}\n`, `logs/${serverStartStamp}.txt`)
    }

    next()
}

module.exports = logger