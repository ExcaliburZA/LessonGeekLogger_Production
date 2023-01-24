const mongoose = require('mongoose');

let LogSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    student_name: {
        type: String,
        required: true
    },
    tutor_name: {
        type: String,
        required: true
    },
    lesson_type: {
        type: String,
        required: true
    }
} , {collection: "logs"});

let Log = mongoose.model('Log' , LogSchema);
module.exports = Log;