const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
    stepId: String,
    name: String,
    description: String,
    duedate: String,
    completed: Boolean
});

module.exports = mongoose.model('step', stepSchema);