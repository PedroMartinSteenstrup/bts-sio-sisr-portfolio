const express = require("express");
const router = express.Router();
const getData = require("../db").getData;

/**
 * @desc Lister toutes les réalisations recensées
 */

// Redirect route
router.get('/E4', (req, res) => {
    res.redirect(301, '/realisations');
});

router.get("/realisations", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM realisations ORDER BY r_début DESC;"
    getData(SQLquery)
        .then((data) => {
            res.render('realisations.ejs',
                { realisations: data, title: req.app.locals.title });
        });
});

/**
 * @desc Voir le détail d'une réalisation
 */
router.get("/realisation/:id", (req, res, next) => {
    var id = req.params.id;
    // Define the query
    SQLquery = `SELECT * FROM realisations WHERE id = $1::int;`
    getData(SQLquery, [id])
        .then((data) => {
            console.log(data[0])
            res.render('realisation_view.ejs',
                { realisation: data[0], title: req.app.locals.title });
        });
});

// Export the router object so index.js can access it
module.exports = router;