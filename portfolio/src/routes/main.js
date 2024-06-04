/**
 * main.js
 *
 */

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { authenticateJWT } = require('./utilisateurs');
const { route } = require("./upload");

/**
 * @desc Display the home page
 */
router.get("/", (req, res) => {
  res.render("index.ejs");
});


router.get('/settings', authenticateJWT, (req, res) => {
  const d = new Date(0);
  d.setUTCSeconds(res.locals.user.exp)

  res.render("parametres", {
    user: res.locals.user.username,
    exp: d,
    port: process.env.NODE_PORT,
    title: "Portfolio - Paramètres",
  });
})

router.get('/test', authenticateJWT, (req, res) => {
  let locRoutes = []
  router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      locRoutes.push(r.route.path)
    }
  })

  res.render('test', {
    port: process.env.NODE_PORT,
    title: "Portfolio - Test",
    routes: locRoutes
  })
})

/**
 * @desc Une page présentant brièvement la raison d'être du portfolio
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: "Portfolio - A propos"
  });
});

//////////////////////////////////////////////////////
// Export the router object so index.js can access it
module.exports = router;
