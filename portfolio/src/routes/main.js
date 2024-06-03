/**
 * main.js
 *
 */

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { authenticateJWT } = require('./utilisateurs');

/**
 * @desc Display the home page
 */
router.get("/", (req, res) => {
  res.render("index.ejs");
});


router.get('/settings', authenticateJWT, (req, res) => {
  let title = "Portfolio - Paramètres";
  res.render("parametres", { title });
})

router.get('/test', (req, res) => {
  let title = "Portfolio - Test";
  res.send(`This server is running on port ` + process.env.NODE_PORT +
    `<br>` +
    router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        console.log(r.route.path)
      }
    }) +
    `<title>` + title + `</title>`)
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
