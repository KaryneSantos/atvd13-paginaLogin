const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            res.status(500).send('Erro ao fazer logout');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;