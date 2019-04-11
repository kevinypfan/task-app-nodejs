const { accounts } = require('../utils/data');

const authMiddleware = (req, res, next) => {
    if (!req.header('Authorization'))
        return res.status(401).send({ message: '請設定token!' });
    const token = req.header('Authorization').split(' ')[1];
    const user = accounts.find(e => e.tokens.indexOf(token) !== -1);
    if (!user)
        return res.status(401).send({
            message: '請先登入!'
        });
    req.user = user;
    next();
};

module.exports = authMiddleware;
