const express = require('express')
const app = express()
const port = 3001
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

app.locals.title = "Portfolio de Pedro";
app.locals.author = "Pedro Martin";

// Items in the global namespace are accessible throught out the node application
// https://node-postgres.com/features/pooling
const Pool = require("pg").Pool;
// https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
global.pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

const defRoutes = require('./routes/courses')

// Add all the route handlers to the app 
const mainRoutes = require('./routes/main');
app.use(mainRoutes);

const coursesRoutes = require('./routes/courses');
app.use(coursesRoutes);

const xpRoutes = require('./routes/experiences');
app.use(xpRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
