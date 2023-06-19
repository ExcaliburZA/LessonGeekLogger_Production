const mongoose = require('mongoose');

let JobSchema = mongoose.Schema({
    student_name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        required: true,
        default: 0
    },
    tutor_name: {
        type: String,
        required: false,
        default: ""
    },
    comments: {
        type: Array,
        required: false,
        default: []
    }
} , {collection: 'jobs'});

let Job = mongoose.model('Job' , JobSchema);
module.exports = Job;