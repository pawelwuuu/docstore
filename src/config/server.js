const express = require('express')
const dotenv = require('dotenv');
const app = express();
const path = require('node:path');
const mainRouter = require(path.join(__dirname, '..', 'routes', 'mainRouter'));
const adminRouter = require(path.join(__dirname, '..', 'routes', 'adminRouter'));
const apiRouter = require(path.join(__dirname, '..', 'routes', 'apiRouter'));
const profileRouter = require(path.join(__dirname, '..', 'routes', 'profileRouter'));
const commentRouter = require(path.join(__dirname, '..', 'routes', 'commentRouter'));
const authRouter = require(path.join(__dirname, '..', 'routes', 'authRouter'));
const bodyParser = require('body-parser');
const setupHelmet = require('./helmet');
const logger = require(path.join(__dirname,'..', 'middlewares', 'logger'));
const ensureDbConnection = require(path.join(__dirname,'..', 'middlewares', 'dbConnectionMiddleware'));
const authMiddleware = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));
const errorHandler = require(path.join(__dirname,'..', 'middlewares', 'errorHandler'));
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));


//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','views'));



setupHelmet(app);
app.use(ensureDbConnection);
app.use(authMiddleware.signInUser);
app.use(logger);
app.use(mainRouter);
app.use(apiRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(authMiddleware.requireLogin, commentRouter);
app.use(authMiddleware.ensureAdminAccess ,adminRouter);

app.use(errorHandler);

process.on('uncaughtException', (err) => {
    console.log('\x1b[41m\x1b[37m%s\x1b[0m', `Uncaught error occurred ${err}`);
    console.log('\x1b[41m\x1b[37m%s\x1b[0m', err);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

module.exports = app