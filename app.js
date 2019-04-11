const express = require('express');

const taskRouter = require('./router/task');
const userRouter = require('./router/user');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.static('./client'));

app.use(taskRouter);
app.use(userRouter);

app.listen(PORT, () => {
    console.log('hello task app start up port: ' + PORT);
});
