const mongoose = require('mongoose');
const User = require('../models/user')

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createAt: { type: Date },
    updateAt: { type: Date }
})
// TaskSchema.pre('save', async function (next) {
//     var task = this;
//     const user = await User.findOne({ _id: req.user._id }).update({ $push: { tasks } })
//     next();

// })
module.exports = mongoose.model('Task', TaskSchema);