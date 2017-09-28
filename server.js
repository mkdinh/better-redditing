// IMPORTING MODULES
// -------------------------------------------------------------------
const express = require('express');
    const app = express();
    const port = process.env.PORT || 3000;

// modules to configure express
const hdbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose  = require('mongoose');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// MONGOOSE SERVER CONNECTION
// ------------------------------------------------------------------

// -connection mongoose to mongo server
mongoose.connect('mongodb://localhost/better-redditing');
const db = mongoose.connection;

// on error, console log out error
db.on('error', (error) => {
    console.log(error);
});

// Once connect to server, log a success message
db.once('open', () => {
    console.log('Mongoose connection successfully!');
});

// EXPRESS CONFIGURATION
// -------------------------------------------------------------------

// express middleware for parsing req.bodt
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set express default view engine to main.handlebars
app.engine('handlebars', hdbs({defaultLayout: path.join(__dirname, 'app/views/layouts/main.handlebars')}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/app/views/'));

// enable express to read static files
app.use(express.static(path.join(__dirname, 'app/public')));

// set route for HTTP requests
const scraper_API = require( path.join(__dirname, '/app/controllers/scrapes.js'));
const comment_API = require( path.join(__dirname, '/app/controllers/comments.js'));

app.use("/", scraper_API);
app.use("/comment", comment_API);

// start server
app.listen(port, () => {
    console.log(port)
})





