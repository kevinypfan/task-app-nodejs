const express = require('express');
const mongoose = require('mongoose');

const { init } = require('./utils/data')

const taskRouter = require('./router/task');
const userRouter = require('./router/user');

mongoose.connect('mongodb://localhost/test', { useCreateIndex: true, useNewUrlParser: true });

var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PORT = 3000;

const app = express();
init()
app.use(express.json());
app.use(express.static('./client'));

app.use(taskRouter);
app.use(userRouter);

app.listen(PORT, () => {
    console.log('hello task app start up port: ' + PORT);
});
