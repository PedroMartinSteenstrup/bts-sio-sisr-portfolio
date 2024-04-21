const express = require('express')
const path = require('node:path');
const app = express()
const port = process.env.NODE_PORT
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '../public')); // set location of static files

app.locals.title = "Portfolio de Pedro";
app.locals.author = "Pedro Martin";
app.use('/favicon.ico', express.static('favicon.ico'));

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// Add all the route handlers to the app 
const mainRoutes = require('./routes/main');
app.use(mainRoutes);

const coursesRoutes = require('./routes/courses');
app.use(coursesRoutes);

const xpRoutes = require('./routes/experiences');
app.use(xpRoutes);

const reaRoutes = require('./routes/realisations');
app.use(reaRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
