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
  res.send(`This is the server endpoint on port ` + process.env.NODE_PORT)
});

router.get('/settings', (req, res) => {
})


//////////////////////////////////////////////////////
// Export the router object so index.js can access it
module.exports = router;
