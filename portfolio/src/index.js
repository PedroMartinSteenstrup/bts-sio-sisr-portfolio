const express = require('express')
const path = require('node:path');
const crypto = require('crypto');
const favicon = require('serve-favicon');
const app = express()
const port = process.env.NODE_PORT
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static('../public'));  // set location of static files
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.locals.title = "Portfolio de Pedro";
app.locals.author = "Pedro Martin";

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader("Vary", "Origin");
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "*");
  // res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Generate nonce
  const csp = `
    default-src 'self' https://portfolio-bts.s3.rbx.io.cloud.ovh.net/;
    img-src 'self' data: https://portfolio.fief.ovh data: https://portfolio-bts.s3.rbx.io.cloud.ovh.net/;
    script-src 'self' 'nonce-${res.locals.nonce}';
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    frame-src 'self' data: https://portfolio-bts.s3.rbx.io.cloud.ovh.net/;
    object-src 'self' https://portfolio-bts.s3.rbx.io.cloud.ovh.net/;
  `;
  res.setHeader("Content-Security-Policy", csp.replace(/\s{2,}/g, ' ').trim());
  next();
});

app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // Make user info available in templates
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

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

const upRoutes = require('./routes/upload');
app.use(upRoutes);

const logRoutes = require('./routes/utilisateurs');
app.use(logRoutes.router);

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
