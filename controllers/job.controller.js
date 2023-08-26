const { default: mongoose } = require('mongoose');
const Jobs = require('../frontend/src/models/job_model');
const { ObjectId } = require('mongodb');

exports.AddJob = async function(req, res){
    let job = {
        student_name: req.headers['student_name'],
        subject: req.headers['subject'],
        grade: req.headers['grade'],
        area: req.headers['area'],
        desc: req.headers['description']
    }

    Jobs.create(job)
    .then((result) => {
        res.status(200).send({result: result})
    })
}

exports.DeleteJob = async function(req, res){
    Jobs.deleteOne({_id: req.params._id})
    .then((ret) => {
        res.status(200).send({deleted: ret});
    })
}

exports.AcceptJob = async function(req, res){
    Jobs.findByIdAndUpdate(req.params._id , {$set: {tutor_name: req.params.tutor_name}} , {new: true})
    .then((ret) => {
        res.status(200).send({updated_doc: ret}); //working I think
    })
}

exports.GetJob = async function(req, res){   
    await Jobs.findById({_id: req.params._id})
    .then((ret) => {
        //console.log("Job likes: ", ret[0].likes);
        res.status(200).send({likes: ret[0].likes});
    })
}

exports.AddLike = async function(req, res){  
    console.log("AddLike()"); 
    await Jobs.findByIdAndUpdate(req.params._id , {$inc: { likes: 1 }} , {new: true})
    .then((ret) => {
        res.send(ret);
    })
}

exports.AddComment = async function(req, res){
    //console.log("AddComment()"); 
    const comment = {
        comment: req.headers['comment'], 
        author: req.headers['author']
    }
    //console.log(req.headers);
    console.log("COMMENT AND AUTHOR: "+comment.comment + " : "+comment.author);

    //console.log("Comment: "+commentBody+"\nAuthor: "+author); //working!
    //console.log(comment);

    //console.log("req.params:\n"+req.);
    
    //await Jobs.findByIdAndUpdate(req.params._id , {$push: {comments: comment}})
    await Jobs.findOneAndUpdate({_id: req.params._id} , {$push: {comments: comment}} , {new: true})
    .then((newDoc) => {
        res.send({newDoc});
    })
    
}

exports.GetJobs = async function(req, res){
    Jobs.find()
    .then((ret) => {
        if(JSON.stringify(ret)){
            //console.log("Available jobs: ", ret.jobs.length);
            //console.log("Type of returned val: ", typeof(ret));
            res.status(200).send({jobs: ret});
        } else {
            console.log("No jobs to display at this time");
            res.status(200).send({jobs: []});
        }
    })
}

exports.GetJob = async function(req, res){
    console.log(req.params._id);
    Jobs.findById(req.params._id)
    .then((ret) => {
        let json = JSON.stringify(ret);     
        //console.log("JSON: ", json);
        if(json){
            console.log("Type of returned val: ", typeof(ret));
            res.status(200).send({jobs: ret});
        } else {
            console.log("No jobs to display at this time");
            res.status(200).send({jobs: ret.jobs});
        }
    })
}