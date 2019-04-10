const express = require('express');
const uuidv4 = require('uuid/v4');
const Buffer = require('buffer').Buffer;

const PORT = 3000;

const app = express();

const accounts = [
    {
        id: uuidv4(),
        name: 'Kevin',
        email: 'kevin@test.com',
        password: 'abc123',
        tokens: ['MTU1NDgxNjU2Mjc0OA']
    },
    {
        id: uuidv4(),
        name: 'Kao',
        email: 'kao@test.com',
        password: 'aaa123',
        tokens: []
    }
];

const tasks = [];

function genToken() {
    const date = Date.now().toString();
    const base64Date = Buffer.from(date).toString('base64');
    const base64url = base64Date
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return base64url;
}

app.use(express.json());
app.use(express.static('./client'))

app.get('/accounts', (req, res) => {
    res.send(accounts);
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const findOne = accounts.find(e => e.email === email);
    if (findOne)
        return res.status(400).send({
            message: '您的email已重複!'
        });
    const token = genToken();
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        tokens: [token]
    };
    accounts.push(newUser);
    res.set('Authorization', token);
    res.status(201).send(newUser);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = accounts.find(e => e.email === email);
    if (!user)
        return res.status(404).send({
            message: '找不到此用戶!'
        });
    if (user.password !== password)
        return res.status(401).send({
            message: '使用者密碼錯誤!'
        });
    const token = genToken();
    res.set('Authorization', token);
    user.tokens.push(token);
    res.send(user);
});

app.get('/tasks', (req, res) => {
    const populateTasks = tasks.map(task => ({
        ...task,
        owner: accounts.find(e => e.id === task.owner)
    }));
    res.send(populateTasks);
});

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    const user = accounts.find(e => e.tokens.indexOf(token) !== -1);
    if (!user)
        return res.status(401).send({
            message: '請先登入!'
        });
    req.user = user;
    next();
};

app.get('/ownTasks', authMiddleware, (req, res) => {
    const ownTasks = tasks.filter(task => task.owner === req.user.id);
    res.send(ownTasks);
});

app.post('/tasks', authMiddleware, (req, res) => {
    const { title, description } = req.body;
    if (!title)
        return res.status(400).send({
            message: '任務至少要有標題!'
        });
    const task = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        owner: req.user.id,
        timestamp: Date.now()
    };
    tasks.push(task);
    res.send({
        ...task,
        owner: req.user
    });
});

app.patch('/task/:id', authMiddleware, (req, res) => {
    const task = tasks.find(e => e.id === req.params.id);
    if (!task)
        return res.status(404).send({
            message: '找不到此筆任務!'
        });
    if (req.user.id !== task.owner)
        return res.status(403).send({
            message: '您的權限不足!'
        });
    if (req.query.completed) {
        task.completed = req.query.completed === 'true';
    } else {
        task.completed = !task.completed;
    }
    res.send(task);
});

app.delete('/task/:id', authMiddleware, (req, res) => {
    const task = tasks.find(e => e.id === req.params.id);
    if (!task)
        return res.status(404).send({
            message: '找不到此筆任務!'
        });
    if (req.user.id !== task.owner)
        return res.status(403).send({
            message: '您的權限不足!'
        });
    const taskIndex = tasks.map(e => e.id).indexOf();
    tasks.splice(taskIndex, 1);
    res.send({
        message: `deleted task id: ${req.params.id}`
    });
});

app.listen(PORT, () => {
    console.log('hello task app start up port: ' + PORT);
});
