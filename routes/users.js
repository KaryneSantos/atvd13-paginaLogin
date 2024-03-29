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

router.delete('/delete/:email', isAuthenticated, async (req, res) => {
    const { email } = req.params;

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM usuarios WHERE email = ?', [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.affectedRows === 0) {
            console.log('Usuário não existe.');
            res.status(404).send('Usuário não encontrado');
        } else {
            console.log('Usuário deletado com sucesso.');
            res.status(200).send('Usuário excluído com sucesso');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro ao excluir usuário');
    }
});

module.exports = router;