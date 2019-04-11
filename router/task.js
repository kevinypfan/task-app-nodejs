const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uuidv4 = require('uuid/v4');
const { accounts, tasks } = require('../utils/data');

const router = express.Router();

router.get('/tasks', (req, res) => {
    const populateTasks = tasks.map(task => ({
        ...task,
        owner: accounts.find(e => e.id === task.owner)
    }));
    res.send(populateTasks);
});

router.get('/ownTasks', authMiddleware, (req, res) => {
    const ownTasks = tasks.filter(task => task.owner === req.user.id);
    res.send(ownTasks);
});

router.post('/tasks', authMiddleware, (req, res) => {
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

router.patch('/task/:id', authMiddleware, (req, res) => {
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

router.delete('/task/:id', authMiddleware, (req, res) => {
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

module.exports = router;
