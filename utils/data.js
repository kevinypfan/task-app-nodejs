const uuidv4 = require('uuid/v4');

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

module.exports = { accounts, tasks };
