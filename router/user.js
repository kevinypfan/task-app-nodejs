const express = require('express');
const router = express.Router();
// const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../models/user')
const { genToken } = require('../utils/helpers');
const { accounts, tasks } = require('../utils/data');


router.post('/signup', (req, res) => {
    const { first_name, family_name, email, password } = req.body;
    // const findOne = accounts.find(e => e.email === email);
    // if (findOne)
    //     return res.status(400).send({
    //         message: '您的email已重複!'
    //     });

    const token = genToken();
    const tokens = []

    tokens.push({ token })
    console.log(tokens)
    const user = new User({
        first_name,
        family_name,
        email,
        password,
        tokens
    });
    user.save().then(result => {
        res.send(result)
    }).catch(err => res.status(402).send(err))
});


router.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findByCredentials(email, password).then((user) => {
        const token = genToken();
        user.tokens.push({ token })
        user.save().then(result => {
            res.set('Authorization', token);
            res.send(user);
        }).catch(err => res.status(402).send(err))

    })
})


router.delete('/logout', authMiddleware, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send('success');
    }).catch(() => {
        res.status(400).send('fail');
    })
})

module.exports = router;
