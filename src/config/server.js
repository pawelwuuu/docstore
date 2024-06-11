const express = require('express')
const dotenv = require('dotenv');
const app = express()
const path = require('node:path');
const mainRouter = require(path.join(__dirname, '..', 'routes', 'mainRouter'));
const apiRouter = require(path.join(__dirname, '..', 'routes', 'apiRouter'));
const authRouter = require(path.join(__dirname, '..', 'routes', 'authRouter'));
const bodyParser = require('body-parser');
const logger = require(path.join(__dirname,'..', 'middlewares', 'logger'));
const authMiddleware = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));
const errorHandler = require(path.join(__dirname,'..', 'middlewares', 'errorHandler'));
const cookieParser = require('cookie-parser')

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','views'));

app.use(authMiddleware.signInUser)
app.use(logger);
app.get('/err', async (req, res, next) => {
    next(new Error("cos sie stalo"))
})
app.use(mainRouter);
app.use(apiRouter);
app.use(authRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})

module.exports = app