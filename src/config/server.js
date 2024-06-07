const express = require('express')
const dotenv = require('dotenv');
const app = express()
const path = require('node:path');
const generalRouter = require(path.join(__dirname, '..', 'routes', 'generalRouter'));
const apiRouter = require(path.join(__dirname, '..', 'routes', 'apiRouter'));
const bodyParser = require('body-parser');
const logger = require(path.join(__dirname,'..', 'middlewares', 'logger'))
const errorHandler = require(path.join(__dirname,'..', 'middlewares', 'errorHandler'))

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use(bodyParser.json());

//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','views'));


app.use(logger);
app.get('/err', async (req, res, next) => {
    next(new Error("cos sie stalo"))
})
app.use('/', generalRouter);
app.use('/api', apiRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})

module.exports = app