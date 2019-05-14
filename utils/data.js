const User = require('../models/user')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/test', { useCreateIndex: true, useNewUrlParser: true });

const users = [{
    first_name: "Kevin",
    family_name: "ypfan",
    email: "kevin@gmail.com",
    password: "123456",
    createAt: new Date()
}, {

    first_name: "YU-CHIAO",
    family_name: "CHANG",
    email: "kg650034@gmail.com",
    password: "123456",
    createAt: new Date()
}]

const hashuser = users.map(user => {
    user.password = bcrypt.hashSync(user.password, 10);
    return user
})

const init = async function () {
    const result = await User.findOne({ email: "kevin@gmail.com" })
    if (result) {
        console.log("init already")

    }
    else {
        User.insertMany(hashuser, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("insert ok");
            }
        });
    }
}



module.exports = { init };
