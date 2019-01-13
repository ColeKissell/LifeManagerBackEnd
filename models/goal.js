const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const goalSchema = new Schema({
    name: String,
    description: String,
    dueDate: String,
    completed: Boolean,
    resources: [
        {
            name: String,
            completed: Boolean
        }
    ],
    stepsRequired:[
        {
            id: String,
            name: String,
            description: String,
            duedate: String,
            completed: Boolean
        }
    ]

});

module.exports = mongoose.model('goal', goalSchema);