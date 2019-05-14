const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/task')
const User = require('../models/user')
const { accounts, tasks } = require('../utils/data');

const router = express.Router();

router.get('/tasks', async (req, res) => {
    try {
        const Tasks = await Task.find()
        if (Tasks.length == 0) {
            throw ("找不到相關清單任務")
        }
        res.send(Tasks)
    } catch (error) {
        res.status(404).send(error)
    }
});

router.get('/ownTasks', authMiddleware, async (req, res) => {
    try {
        const ownTasks = await Task.find({ author: req.user._id })
        if (ownTasks.length == 0) {
            throw ("找不到相關清單任務")
        }
        res.send(ownTasks)
    } catch (error) {
        res.status(404).send(error)
    }

});

router.post('/tasks', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({
        title,
        description,
        completed: false,
        author: req.user._id,
        createAt: Date.now()
    });

    task.save().then(result => {
        User.findOne({ _id: req.user._id })
            .update({ $push: { "tasks": result._id } })
            .then(user => {
                console.log(user)
                next()
            }).catch(error => {
                console.log(error)
            })

        res.send(result)
    }).catch(error => {
        res.status(402).send(error)
    });

});

router.patch('/task/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id })

    console.log(task.author.toString() == req.user._id.toString())

    if (!task)
        return res.status(404).send({
            message: '找不到此筆任務!'
        });
    if (req.user._id.toString() != task.author.toString())

        return res.status(403).send({
            message: '您的權限不足!'
        });
    if (req.query.completed) {
        task.completed = req.query.completed;
        try {
            const result = await task.save()
            if (!result) {
                throw ("fail")
            }
            res.send(result);
        } catch (error) {
            res.status(402).send(error)
        }

    }

});

router.delete('/task/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        })
        if (!result) {
            throw ("找不到任務")
        }
        res.send(result)
    } catch (error) {
        res.status(404).send(error)
    }


});

module.exports = router;
