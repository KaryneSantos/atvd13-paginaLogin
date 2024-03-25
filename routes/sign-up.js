const express = require('express');
const router = express.Router();
const connection = require('../models/db');

router.get('/', (req, res) => {
    const registrationAlert = '';
    res.render('register', { title: 'Register', registrationAlert });
});

router.post('/', (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (name === '' || email === '' || password === '') {
        const registrationAlert = 'Campos obrigatórios não preenchidos';
        res.render('register', { title: 'Register', registrationAlert, name, email });
        return;
    }

    if (password !== confirm_password) {
        const registrationAlert = 'As senhas não coincidem';
        res.render('register', { title: 'Register', registrationAlert, name, email });
        return;
    }

    const sql = 'INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            const registrationAlert = 'Erro ao registrar usuário';
            res.render('register', { title: 'Register', registrationAlert, name, email });
            return;
        }
        console.log('Usuário registrado com sucesso');
        res.redirect('/');
    });
});

module.exports = router;
