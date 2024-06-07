const express = require('express')
const dotenv = require('dotenv');
const app = express()
const path = require('node:path');
const generalRouter = require(path.join(__dirname, '..', 'routes', 'generalRouter'));
const apiRouter = require(path.join(__dirname, '..', 'routes', 'apiRouter'));
const bodyParser = require('body-parser');
const logger = require(path.join(__dirname,'..', 'middlewares', 'logger'))

dotenv.config({ path: path.join(__dirname, '..', '.env') });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','views'));

app.use(express.static(path.join(__dirname, '..','public')));
app.use('/', generalRouter);
app.use('/api', apiRouter);
app.use(bodyParser.json());
app.use(logger)
app.use((err,req,res,next) => {
    console.log(err)
    next()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})

module.exports = app