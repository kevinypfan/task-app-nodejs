const User = require('../models/user')

const authMiddleware = async (req, res, next) => {
    // console.log(req.header('Authorization'))

    if (!req.header('Authorization'))
        return res.status(401).send({ message: '請設定token!' });
    const token = req.header('Authorization').split(' ')[1];
    // console.log(token)
    const user = await User.findOne({ "tokens.token": token });
    if (!user)
        return res.status(401).send({
            message: '請先登入!'
        });
    req.user = user;
    req.token = token;
    // console.log(req.user)
    next();
};

module.exports = authMiddleware;
