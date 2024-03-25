const express = require('express');
const router = express.Router();
const connection = require('../models/db');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
};

router.get('/', isAuthenticated, (req, res) => {
    res.render('home');
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM usuarios', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        res.render('users', { users: rows });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao buscar usuários');
    }
});

module.exports = router;
