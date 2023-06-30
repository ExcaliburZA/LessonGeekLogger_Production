const Users = require('../frontend/src/models/user_model');
const jwt = require('jsonwebtoken');
const e = require('express');
const cryptojs = require('crypto-js');
const secrets = require('../secrets');
//const Users = require('../frontend/src/models/user_model');



exports.LogIn = async function(req, res) {
    //console.log("Controller LOGIN called");

    //let secret = secrets.SECRET_KEY;
    //let password = cryptojs.AES.decrypt(req.headers['password'], secret);
    //password = password.toString(cryptojs.enc.Utf8);
    let password = req.headers['password'];
    console.log(password);
    
    Users.find({name: {$eq: req.headers['name']} , password: {$eq: password}})
    .then((ret) => {
        //ret.length > 0 ? console.log(true) : console.log(false); shows correctly
        //console.log(ret[0]);
        
        //if(ret.length > 0){ //if found...
        
        //fails whenever it hits the else
        if(ret.length > 0){ //if found...
            let token = GenToken(ret[0].name , ret[0].password, ret[0].approved, ret[0].role);
            console.log("User controller says: "+ret[0].name+" logged in!\nToken: "+token);           
            res.status(200).send({"token": token}) 
        } else {
            console.log("User controller says: Login failed");
            res.status(200).send({"token": "NA"});      
        };
        
        

    })  
    
}

exports.RegisterUser = async function(req, res) {
    console.log("RegisterUser() says key: "+String(secrets.SECRET_KEY));
    //console.log("RegisterUser() says length of key: "+String(secrets.SECRET_KEY).length());
    let decryptedPassword = cryptojs.AES.decrypt(req.headers['password'], secrets.SECRET_KEY);
    decryptedPassword = decryptedPassword.toString(cryptojs.enc.Utf8);

    let decryptedAccNum = cryptojs.AES.decrypt(req.headers['account_no'], secrets.SECRET_KEY);
    decryptedAccNum = decryptedAccNum.toString(cryptojs.enc.Utf8); 

    let newUser = {
        name: req.headers['name'], 
        password: decryptedPassword,
        ID: req.headers['id'],
        phone_no: req.headers['phone_no'],
        email: req.headers['email'],
        account_no: decryptedAccNum,
        university: req.headers['university'],
        course_name: req.headers['course_name'],
        date_of_birth: req.headers['date_of_birth'],
        approved: false,
        role: 'tutor',
        area: req.headers['area']
    }

    
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
        //res.status(200).send({"error_msg": "username already exists"});
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
        //console.log(result[0]);
        res.send({result});          
        
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
    .then((result) => {
        res.send({result});
        console.log("Fetched: \n"+result);
    })
}

exports.DeleteUser = async function(req, res){
    Users.deleteOne({_id: req.params._id})
    .then((ret) => {
        res.status(200).send({deleted: ret});
    })
}

