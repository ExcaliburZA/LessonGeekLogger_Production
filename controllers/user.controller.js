const Users = require('../frontend/src/models/user_model');
const jwt = require('jsonwebtoken');
const e = require('express');

exports.LogIn = async function(req, res) {
    Users.find({name: {$eq: req.params.name} , password: {$eq: req.params.password}})
    .then((ret) => {
        if(ret.length > 0){ //if found...
            let token = GenToken(ret[0].name , ret[0].password, ret[0].approved, ret[0].role);
            console.log("User controller says: "+req.params.name+" logged in!");
            res.status(200).send({"token": token})
        } else {
            console.log("User controller says: Login failed");
            res.status(500).send({"token": "NA"});      //sends correctly
        };

    })  
}

exports.RegisterUser = async function(req, res) {
    let newUser = {
        name : req.params.name,
        password: req.params.password,
        ID: req.params.ID,
        phone_no: req.params.phone_no,
        email: req.params.email,
        account_no: req.params.account_no,
        university: req.params.university,
        course_name: req.params.course_name,
        date_of_birth: req.params.date_of_birth,
        approved: req.params.approved,
        role: 'tutor',
        area: req.params.area
    };

    let userExists = await Users.findOne( {name: {$eq: newUser.name}} );
    if(!userExists) {
        Users.create(newUser)
        .then(result => {
            console.log("Registration result:\n", result);
            let token = GenToken(newUser.name, newUser.password , newUser.approved , newUser.role);
            res.status(200).send({"token": token});
        })
    } else {
        console.log("Controller: "+newUser.name+" already exists!");
        res.status(200).send({"token": "NA"});
    }
}

function GenToken(name, password, approved, role){
    let payload = {
        'name':name,
        'password':password,
        'approved': approved,
        'role':role
    }

    const token = jwt.sign(JSON.stringify(payload) , 'jwt-secret' , {algorithm: 'HS256'});
    return token;
}

exports.GetUnapprovedUsers = async function(req, res){
    Users.find({approved: {$eq : false}})
    .then((result) => {       
        if(result.length > 0)
        {
            //console.log("Unapproved users retrieved:\n", result);
            res.status(200).send({message: "Unapproved users retrieved" , users: result});
        } 
        else{
            console.log("No users awaiting approval at this time")
            res.status(200).send({message: "no pending approvals"})     
        } 
    })
}

exports.ApproveUser = async function(req, res){
    let userName = req.params.name;
    Users.updateOne( {name: userName} , {$set: {approved: true}})
    .then((result) => {
        console.log("Update result:\n", result);
        res.send(result);
    })
}

exports.GetAll = async function(req, res){
    Users.find()
    .then(result => {
        console.log("Fetched: \n"+result);
    })
}

