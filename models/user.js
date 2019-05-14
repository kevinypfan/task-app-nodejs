const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { genToken } = require('../utils/helpers');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    first_name: {
        type: String,
        required: true,
        max: 30
    },
    family_name: {
        type: String,
        required: true,
        max: 20
    },
    password: {
        type: String,
        min: 6
    },
    createAt: {
        type: Date,

    },
    updateAt: {
        type: Date,

    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    tokens: [{
        token: { type: String },

    }]

});


UserSchema.virtual('name').get(function () {
    return this.family_name + ', ' + this.first_name;
})


// 存密碼時加密
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10).then(hash => {
            user.password = hash;
            next();
        })
    } else {
        next();
    }
})




// 比較密碼
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject("沒有這個會員");
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password).then((res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject("此密碼錯誤");
                }
            })
        })
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    })
}

//Export model
module.exports = mongoose.model('User', UserSchema);