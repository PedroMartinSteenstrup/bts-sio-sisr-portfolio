const express = require("express");
const router = express.Router();
const getData = require("../utils_db").getData;

/**
 * @desc Display all the users
 */
router.get("/experiences", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM experiences ORDER BY c_année_début DESC;"
    console.log(SQLquery)

    getData(SQLquery)
        .then((data) => {
            console.log(data)
            res.render('experiences.ejs',
                { experiences: data, title: req.app.locals.title });
        });
});


// Export the router object so index.js can access it
module.exports = router;