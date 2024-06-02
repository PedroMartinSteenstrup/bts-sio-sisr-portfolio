/**
 * main.js
 *
 */

const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");

/**
 * @desc Display the home page
 */
router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get('/test', (req, res) => {
  let title = "Portfolio - Test";
  res.send(`This is the server endpoint on port ` + process.env.NODE_PORT + `<title>`+title+`</title>`)
});

router.get('/settings', (req, res) => {
  let title = "Portfolio - Paramètres";
  res.send(`Not implemented <title>`+title+`</title>`)
})

/**
 * @desc Une page présentant brièvement la raison d'être du portfolio
 */
router.get('/about', (req, res) => {
  res.locals.title = "Portfolio - A propos";
  res.render('about.ejs');
});

//////////////////////////////////////////////////////
// Export the router object so index.js can access it
module.exports = router;
