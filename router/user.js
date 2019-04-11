const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const { genToken } = require('../utils/helpers');
const { accounts, tasks } = require('../utils/data');

router.get('/accounts', (req, res) => {
    res.send(accounts);
});

router.post('/signup', (req, res) => {
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

router.post('/login', (req, res) => {
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

module.exports = router;
