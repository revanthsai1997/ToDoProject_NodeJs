
const mongoose = require('mongoose');
const uniqid = require('uniqid');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    todoId: {
        type:String,
        required:true,
        unique: true,
        default: uniqid()+uniqid.process()+uniqid.time()+ (new Date().toString())
    },
    user: {
        type:String,
        required: true
    },
    todo: {
        type:String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        require: true,
        default: false
    }
});

module.exports = mongoose.model('Todo',TodoSchema);