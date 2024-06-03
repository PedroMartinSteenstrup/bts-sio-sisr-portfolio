const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { insertData, getData } = require('../utils_db');

const SECRET_KEY = process.env.SECRET_KEY;
// Pre-shared key pour création d'utilisateur initiale
const preSharedKey = process.env.PRE_SHARED_KEY;


// Middleware pour valider pre-shared key
function authenticate(req, res, next) {
    // The API key is sent in a header
    const apiKey = req.headers['x-api-key']; 
    if (apiKey && apiKey === preSharedKey) {
      // API valide, on continue
      next();
    } else {
      // Clé API manquante ou invalide
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

// Middleware pour authentifier avec JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            res.locals.user = user;
            next();
        });
    } else {
        res.locals.user = null;
        res.redirect('/login');
    }
};

// Register route seulement via API
// router.get('/register', (req, res) => {
//     res.render('register'); // Render the registration form
// });

// 
router.post('/register', authenticate, async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await insertData('INSERT INTO utilisateurs (nom, m2p_hash) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);

        const user = result.rows[0];
        const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to render login page
router.get('/login', (req, res) => {
    if (res.locals.user) {
        return res.redirect('/settings');
      }
    res.render('login');
});


// Route to handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await getData('SELECT * FROM utilisateurs WHERE nom = $1', [username]);
        console.log(result);
        if (result.length === 0) {
            return res.render('login', { error: 'Utilisateur inconnu' });
        }
        const user = result[0];

        const match = await bcrypt.compare(password, user.m2p_hash);

        if (match) {
            const token = jwt.sign({ username: user.nom }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } else {
            res.render('login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Export the router object so index.js can access it
module.exports = {
    router: router,
    authenticateJWT: authenticateJWT
};