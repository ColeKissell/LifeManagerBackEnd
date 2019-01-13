const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    body: String,
    goalId: String,
    completed: Boolean
});

module.exports = mongoose.model('todo', todoSchema);