const express = require("express");
const router = express.Router();
const getData = require("../utils_db").getData;

/**
 * @desc Display all the users
 */
router.get("/list-courses", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM courses;"
    getData(SQLquery)
        .then((data) => {
            res.render('courses.ejs',
                {
                    courses: data,
                    title: req.app.locals.title
                });
        });
});

// Export the router object so index.js can access it
module.exports = router;