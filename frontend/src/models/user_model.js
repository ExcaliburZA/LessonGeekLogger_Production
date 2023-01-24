const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ID: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    account_no: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: "tutor"
    },
    area: {
        type: String,
        required: true
    }
} , {collection: 'users'});

let User = mongoose.model('User' , UserSchema);
module.exports = User;