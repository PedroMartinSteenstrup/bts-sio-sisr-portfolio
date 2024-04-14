const express = require("express");
const router = express.Router();

//get all from our database
const getData = async (sql_query) => {
    try {
        return await new Promise(function (resolve, reject) {
            pool.query(sql_query, (error, results) => {
                if (error) {
                    reject(error);
                }
                if (results && results.rows) {
                    resolve(results.rows);
                } else {
                    reject(new Error("No results found"));
                }
            });
        });
    } catch (error_1) {
        console.error(error_1);
        throw new Error("Internal server error");
    }
};
/**
 * @desc Display all the users
 */
router.get("/list-courses", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM courses;"
    console.log(SQLquery)

    getData(SQLquery)
        .then((data) => {
            console.log(data)
            res.render('courses.ejs',
                { courses: data, title: req.app.locals.title });
        });
});

// Export the router object so index.js can access it
module.exports = router;
