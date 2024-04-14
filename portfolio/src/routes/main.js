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

router.get('/', (req, res) => {
  model.getCourses()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})


router.get('/test', (req, res) => {
  model.getCourses().then((courses) => {
    res.send(`This is the server endpoint! ` + courses[0][1])
  });
  // res.send(`This is the server endpoint! `+courses)
});


//////////////////////////////////////////////////////
// Export the router object so index.js can access it
module.exports = router;
