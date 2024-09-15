const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const password = 'password123';

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 }
}));

app.set('view engine', 'ejs');

const users = [{
    id: 1,
    username: 'user1',
    password: '$2a$10$Ai9VsVH1mNnlbKivIqHCNO.GJhBo8oTh0shmoQf6BnNmksZIQF0Lq'
}];

app.get('/', (req, res) => {
    if (req.session.userId) {
        res.send(`Welcome, User ${req.session.userId}! <a href="/logout">Logout</a>`);
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id;
            return res.redirect('/');
        }
    }

    res.send('Invalid credentials');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

bcrypt.hash(password, 10, (err, hash) => {
    console.log(hash);
});