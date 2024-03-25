const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const connection = require('../models/db').promise(); 

router.get('/', (req, res) => {
    const loginAlert = '';
    res.render('index', { title: 'Log In', loginAlert });
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    const passwordCrypto = crypto.createHash('md5').update(password).digest('hex');

    try {
        if (email === '' || password === '') {
            throw new Error('Campos obrigatórios! Tente novamente');
        }
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, passwordCrypto]);

        if (rows.length === 0) {
            throw new Error('Email ou senha incorreto');
        }

        req.session.userId = rows[0].id;

        res.redirect('/home');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('index', { title: 'Login In', loginAlert: error.message, email, password });
    }
});

module.exports = router;
