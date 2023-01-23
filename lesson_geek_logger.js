const express = require('express');
const app = express();
const helmet = require('helmet');
const jwt = require('jsonwebtoken')
const PORT = 5000; //process.env.PORT || 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user_controller = require('./controllers/user.controller');
const log_controller = require('./controllers/log.controller');
const job_controller = require('./controllers/job.controller');

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(helmet());
mongoose.Promise = global.Promise;

//login endpoint
app.post('/login/:name/:password' , user_controller.LogIn)

//registration endpoint
app.post('/register/:name/:password/:ID/:phone_no/:email/:account_no/:university/:course_name/:date_of_birth/:area' , user_controller.RegisterUser)

//fetch all users endpoint
app.get('/users' , user_controller.GetAll)

//fetch all user profiles still awaiting approval
app.get('/users/unapproved' , user_controller.GetUnapprovedUsers)

app.post('/approve/:name' , user_controller.ApproveUser)

//view log endpoint
app.get('/log/:_id' , log_controller.ViewLog)

//retrieve all logs for tutor endpoint
app.get('/logs/:name' , log_controller.ViewLogList)

//add new log endpoint
app.post('/log/:date/:hours/:student_name/:tutor_name/:lesson_type' , log_controller.AddLog)

//retrieve likes for job endpoint
//app.get('/job/:_id/likes' , job_controller.GetJob)

app.get('/job/:_id' , job_controller.GetJob)

app.get('/jobs' , job_controller.GetJobs)

app.post('/job/:_id/like' , job_controller.AddLike)

app.post('/job/:_id/accept/:tutor_name' , job_controller.AcceptJob)

app.post('/job/:_id/comment' , job_controller.AddComment)

//responded with decoded token on postman, issue somewhere else
app.get('/decode' , (req, res) => {
    //extracting JWT token from headers 
    const token = req.headers['authorization'].split(' ')[1];   
    console.log("BACKEND SAYS: Extracted token ",token);

    //attemping to verify the JWT token and sending back an appropriate response based on the result
    try{
        const decoded = jwt.verify(token , 'jwt-secret');
        res.send({token: decoded});
    } catch (e) {
        console.log('Error verifying JWT token: ', e);
        res.send( {token: {name: ""}} );
    }
})

/* CODE REFERENCED FROM
https://www.codegrepper.com/profile/philani-sithembiso-ndhlela */
mongoose.connect("mongodb+srv://sudosam:AdminSam420@lessongeek.jehaxbl.mongodb.net/LessonGeek?retryWrites=true&w=majority" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () => console.log("MongoDB connected."))
.catch((err) => {
    console.log("ERROR: ",err.message);
})

//method that indicates thats a connection to the MongoDB database was unsuccessful
mongoose.connection.on('error' , function() {
    //console.log('MongoDB connection established');
        console.log('Could not connect to MongoDB database. Exiting...');
        process.exit();
})

//method that indicates thats a connection to the MongoDB database was successful
mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
    app.listen(PORT, () => console.log("Listening in on port ", PORT));
})

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*',(req,res)=> {res.sendFile(path.resolve(__dirname,
    'frontend', 'build','index.html'));
    });
}

process.on('uncaughtException' , function(err) {
    console.log("Error: "+err);
})