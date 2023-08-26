const Logs = require('../frontend/src/models/log_model');
//const jwt = require('jsonwebtoken');

exports.AddLog = async function(req, res){
    /*
    let log = {
        date: req.params.date,
        hours: req.params.hours,
        student_name: req.params.student_name,
        tutor_name: req.params.tutor_name,
        lesson_type: req.params.lesson_type
    }

    Logs.create(log)
    .then(result => {
        console.log("Log added!\nResult: "+result);
        res.status(200).send({result: result});
    })
    */

    let log = {
        date: req.headers['lesson_date'],
        hours: req.headers['hours'],
        student_name: req.headers['student_name'],
        tutor_name: req.headers['tutor_name'],
        lesson_type: req.headers['lesson_type']
    }
 

    Logs.create(log)
    .then(result => {
        console.log("Log added!\nResult: "+result);
        res.status(200).send({result: result});
    })
}

exports.ViewLog = async function(req, res){
    Logs.find({_id: {$eq: req.params._id}})
    .then(ret => {
        console.log("Retrieved log "+req.params._id+"\n--------------------------");
        res.status(200).send({result: ret});
    })
}

exports.ViewLogList = async function(req, res){
    Logs.find({tutor_name : {$eq: req.params.name}})
    .then(ret => {
        if(ret.length > 0){
            let logs = [];
            for(let x = 0; x < ret.length; ++x){
                logs.push(ret[x]);
            }
            res.status(200).send({logs: logs})
            console.log("Log controller says: Logs for "+req.params.name+" retrieved: "+ret.length);
        } else {
            res.status(200).send({message: "No logs found"});
        }
    })
}

exports.ViewAllLogs = async function(req, res){
    Logs.find()
    .then(ret => {
        if(ret.length > 0){
            let logs = [];
            for(let x = 0; x < ret.length; ++x){
                logs.push(ret[x]);
            }
            res.status(200).send({logs: logs})
            console.log("Log controller says: All logs retrieved: "+ret.length);
        } else {
            res.status(200).send({message: "No logs found"});
        }
    })
}