const express = require('express');
const app = express();
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
    secret: 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: false
}));


const signUpRoutes = require('./routes/sign-up');
const loginRoutes = require('./routes/index');
const homeRoutes = require('./routes/home');
const usersRouters = require('./routes/users');
const logoutRouters = require('./routes/logout');

app.use('/', loginRoutes);
app.use('/sign-up', signUpRoutes);
app.use('/home', homeRoutes);
app.use('/users', usersRouters);
app.use('/logout', logoutRouters);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;