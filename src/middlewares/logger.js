const fileOperations = require('../utils/fileOperations')


const serverStartStamp = require('../utils/serverStartStamp')

const logger = async (req,res,next) => {
    req.time = new Date(Date.now()).toString()

    const username = res.locals.user?.username || 'anonymous'
    if (process.env.LOG_TO_CONSOLE === '1') {
        console.log(req.method, req.hostname, username, req.path, req.time)
    }
    if (process.env.LOG_TO_FILE === '1') {
        await fileOperations.appendToFile(`${req.hostname}:${req.method}:${username} path: ${req.path} time: ${req.time}\n`, `logs/${serverStartStamp}.txt`)
    }

    next()
}

module.exports = logger