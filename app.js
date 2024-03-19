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

let users = [];

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/', (req, res) => {
    const loginAlert = '';
    res.render('index', { title: 'Log In', loginAlert });
});

app.post('/', (req, res) => {
    const { email, password } = req.body;

    const passwordCrypto = crypto.createHash('md5').update(password).digest('hex');

    try {
        if (email === '' || password === '') {
            throw new Error('Campos obrigatórios! Tente novamente');
        }

        const user = users.find(user => user.email === email && user.password === passwordCrypto);

        if (!user) {
            throw new Error('Email ou senha incorreto');
        }

        req.session.userId = user.id;

        res.redirect('/home');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('index', { title: 'Login In', loginAlert: error.message, email, password });
    }
});

app.get('/sign-up', (req, res) => {
    const registrationAlert = '';
    res.render('register', { title: 'Register', registrationAlert });
});

app.post('/sign-up', (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    try {
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            throw new Error('Email já cadastrado');
        }

        if (name === '' || email === '' || password === '') {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        const passwordCrypto = crypto.createHash('md5').update(password).digest('hex');
        const newUser = { id: users.length + 1, name, email, password: passwordCrypto };
        users.push(newUser);

        console.log('Cadastro feito com sucesso.');
        res.redirect('/');
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.render('register', { title: 'Register', registrationAlert: error.message, name, email });
    }
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { title: 'Home Page' });
});

app.get('/users', isAuthenticated, (req, res) => {
    res.render('users', { users });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            res.status(500).send('Erro ao fazer logout');
        } else {
            res.redirect('/'); 
        }
    });
});

app.delete('/delete', isAuthenticated, (req, res) => {
    const { email } = req.body;
    console.log(email);

    const index = users.findIndex(user => user.email === email);

    if (index === -1) {
        console.log('Usuário não existe.');
        res.status(404).send('Usuário não encontrado');
    } else {
        users.splice(index, 1);
        console.log('Usuário deletado com sucesso.');
        res.status(200).send('Usuário excluído com sucesso');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
