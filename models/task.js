const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createAt: { type: Date, default: new Date() },
    updateAt: { type: Date }
})
