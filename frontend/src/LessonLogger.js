import React from "react";
import './App.css';
import TutorLog from "./TutorLog";

import { Button } from "react-bootstrap";
import JobBoard from "./components/JobBoard";
import JobManager from "./components/JobManager";
//import UserManager from "./components/UserManager";
import {api} from "./api";
import axios from "axios";
import CryptoJS from "crypto-js";

//class component
export default class LessonLogger extends React.Component{
    name = ""; 
    password = "";

    ID = "";
    phoneNum = "";
    email = "";
    accountNum = "";
    university = "";
    courseName = "";
    dateOfBirth = new Date().toISOString();
    area = "Cape Town CBD";

    lessonStudent = "";
    lessonDate = new Date().toISOString();
    lessonDuration = "";
    lessonType = "face to face";

    unapprovedTutorName = "";
    unapprovedUsers = [];
    pendingUserCount = 0;

    registerToggle = false;
    
    constructor(props){
        super(props);
        this.state = {name: "" , token: "" , logs: null , role: "", registrationToggled: false , addLogToggle: false , manageUsersToggle: false, unapprovedUsersRetrieved: false , viewJobsToggle: false , jobs: [] , jobsRetrieved: false, jobManagerToggle: false};
        this.registerToggle = false;

        //method binding
        this.LoginComps = this.LoginComps.bind(this);
        this.RegistrationComps = this.RegistrationComps.bind(this);
        this.NewLogComps = this.NewLogComps.bind(this);
        this.UserManager = this.UserManager.bind(this);

        this.GetName = this.GetName.bind(this);
        this.GetPassword = this.GetPassword.bind(this);
        this.LogIn = this.LogIn.bind(this);
        this.Register = this.Register.bind(this);
        this.ToggleRegistration = this.ToggleRegistration.bind(this);
        this.ToggleUserManager = this.ToggleUserManager.bind(this);
        this.ViewJobs = this.ViewJobs.bind(this);

        this.GetLogs = this.GetLogs.bind(this);
        this.AddLog = this.AddLog.bind(this);
        this.SubmitLog = this.SubmitLog.bind(this);
        this.FormatDate = this.FormatDate.bind(this);
        //this.ViewUnapprovedUsers = this.ViewUnapprovedUsers.bind(this);
        this.ApproveUser = this.ApproveUser.bind(this);
        this.Validate = this.Validate.bind(this);
        //this.VerifyAge = this.VerifyAge.bind(this);

        this.GetStudName = this.GetStudName.bind(this);
        this.GetLessonDate = this.GetLessonDate.bind(this);
        this.GetType = this.GetType.bind(this);
        this.GetHours = this.GetHours.bind(this);

        this.GetArea = this.GetArea.bind(this);

        this.GetUnapprovedUser = this.GetUnapprovedUser.bind(this);
        this.Encrypt = this.Encrypt.bind(this);
        this.ValidateLog = this.ValidateLog.bind(this);
    }

    componentDidMount(){
        console.log("Component mounted");
    }

    //RESUME HERE: stop this from returnign to logs page, return to jobs page instead
    async RefreshJobs(){
        await this.ViewJobs();
        this.setState({jobManagerToggle: false} , console.log("Job manager toggled: "+this.state.jobManagerToggle));
    }

    render(){
        //console.log("State logs from render method: ", typeof(this.state.logs));
        console.log("State logs from render method: ", this.state.logs);
        let isAdmin = false;
        if(this.state.role === "admin")
            isAdmin = true;

        if(this.state.logs){ //if user has logged in and their logs have been retrieved  
            //if a new log is about to be added
            if(this.state.addLogToggle){
                return(
                    <div>
                        <this.NewLogComps /><br/><br/>
                        <Button variant="primary" onClick={() => this.AddLog()}>Return</Button>
                        <Button variant="secondary" onClick={() => this.ViewJobs()}>View Jobs</Button>
                    </div>
                    
                )
            } else if(this.state.logs.message === "No logs found"){ //else if no logs were found and "none" was assigned to this.state.logs by GetLogs()
                console.log("Render method says: no logs found for "+this.state.name);
                return(
                    <div>
                        <div className="emptyLogsBox">No logs found for {this.state.name}</div><br/>
                        <Button variant="primary" onClick={() => this.AddLog()}>Add Log</Button>
                        <Button variant="secondary" onClick={() => this.ViewJobs()}>View Jobs</Button>
                        { isAdmin ?  <Button variant="primary" onClick={async() => await this.ToggleUserManager()}>View unapproved users</Button> : null}
                    </div>                                   
                )
            } else if(this.state.manageUsersToggle){
                return(
                    <div>
                        <this.UserManager /><br/>
                        <Button variant="primary" onClick={async() => await this.ApproveUser()}>Approve</Button> 
                        <Button variant="primary" onClick={async() => await this.ToggleUserManager()}>Return</Button> 
                    </div>
                )
            } else if(this.state.viewJobsToggle){
                let parsedJobs = Array.from(this.state.jobs);  
                //console.log("Attempting to display jobs: "+parsedJobs);    
                if(this.state.jobManagerToggle){ //if job manager has been toggled on... show job management screen and button to return to job viewer
                    return(                   
                        <div>
                            {/*parsedJobs.map(job => (
                                <JobBoard key={job.grade+"-"+job.student_name+"-"+job.subject} job={job} tutor_name={this.state.name}/>
                            ))*/}<br/><br/>
                            {/*<Button variant="secondary" onClick={() => this.ViewJobs()}>Return</Button>*/}
                            {isAdmin ? <JobManager jobs={parsedJobs}></JobManager> : <h1 className="emptyLogsBox">{this.state.name} does not have access to this feature</h1>}<br/>
                            <Button id="btnBackToJobs" onClick={async() => {
                                //this.setState({jobManagerToggle: false} , console.log("Job manager toggled: "+this.state.jobManagerToggle));
                                await this.RefreshJobs();
                            }}>Back to jobs page</Button>  
                        </div>
                    )
                } else {
                    return(                   
                        <div>
                            {parsedJobs.map(job => (
                                <JobBoard key={job.grade+"-"+job.student_name+"-"+job.subject} job={job} tutor_name={this.state.name}/>
                            ))}<br/><br/>
                            <Button variant="secondary" onClick={() => this.ViewJobs()}>Return</Button>
                            <Button id="btnBackToJobs" onClick={() => {
                                this.setState({jobManagerToggle: true} , console.log("Job manager toggled: "+this.state.jobManagerToggle));
                            }}>Edit jobs</Button>                            
                        </div>
                    )
                }         


            } else {
                console.log("Logs for ",this.state.name+" found! Logs: "+JSON.stringify(this.state.logs));
                console.log("Retrieved logs index 0: ",this.state.logs[0]);
                console.log("Retrieved logs count: ",this.state.logs.length);
                console.log("Type of state.logs.logs: ",typeof(this.state.logs));
                let parsedLogs = Array.from(this.state.logs.logs);
                console.log("Array elements: "+parsedLogs.length+"\nElement 0: "+parsedLogs[0].tutor_name); //DISPLAYS CORRECT INFORMATION -> array has parsed successfully!                           

                return(
                    <div>
                        <div className="logDisplayArea">
                        {/*parsedLogs.map(function(log) {
                            console.log("Log: "+JSON.stringify(log)); //returns correctly
                            <TutorLog key={log.tutor_name+log.student_name+log.date} date={log.date} hours={log.hours} student_name={log.student_name} tutor_name={log.tutor_name} lesson_type={log.lesson_type}/>
                        })*/}

                        {parsedLogs.map(log => (
                            <TutorLog key={log.tutor_name+log.student_name+log.date} date={this.FormatDate(log.date)} hours={log.hours} student_name={log.student_name} tutor_name={log.tutor_name} lesson_type={log.lesson_type}/>
                        ))}<br/><br/>                       

                        {/*<TutorLog key={parsedLogs[0].tutor_name+parsedLogs[0].student_name+parsedLogs[0].date} date={parsedLogs[0].date} hours={parsedLogs[0].hours} student_name={parsedLogs[0].student_name} tutor_name={parsedLogs[0].tutor_name} lesson_type={parsedLogs[0].lesson_type}/>*/}
                        </div><br/><br/>
                        <Button variant="primary" onClick={() => this.AddLog()}>Add Log</Button> 
                        <Button variant="secondary" onClick={() => this.ViewJobs()}>View Jobs</Button>
                        { isAdmin ?  <Button variant="primary" onClick={async() => await this.ToggleUserManager()}>View unapproved users</Button> : null}
                    </div>

                )
            }     

        } else{ //otherwise display login screen if user has not logged in
            //console.log("Render method says: State logs: ",this.state.logs); LOGS DISPLAYING HERE
            console.log("No logs found");
            if(this.registerToggle === true){
                return(
                    <this.RegistrationComps />
                )
            } else {
                return(
                    <this.LoginComps />
                )
            }
        }
    }

    LoginComps(){
        return(
            <div className="login">
                <img className="logo"/><br/>
                <input onChange={this.GetName} placeholder="Name" /><br/>
                <input onChange={this.GetPassword} placeholder="Password" /><br/><br/>

                <button onClick={this.LogIn}>Log in</button>
                <button onClick={this.ToggleRegistration}>I am a new user</button>
            </div>
        )
    }

    RegistrationComps(){
        const western_cape_areas = [
            "Cape Town CBD",
            "Atlantic Seaboard",
            "Hout Bay",
            "Southern Suburbs",
            "Muizenberg",
            "Fish Hoek",
            "Northern Suburbs",
            "Stellenbosch",
            "Somerset West",
            "Paarl",
            "Milnerton",
            "Blouberg",
            "Worcester",
            "Wellington",
            "Mossel Bay",
            "George",
            "Knysna",
            "Plettenberg Bay"
        ]

        const eastern_cape_areas =[
            "Gqeberha",
            "East London"
        ] 

        const gauteng_areas = [
            "Pretoria",
            "Centurion",
            "Midrand",
            "Sandton",
            "Roodepoort",
            "Krugersdorp",
            "Soweto",
            "Johannesburg South",
            "Vereeniging",
            "Vanderbijlpark",
            "Hartbeespoort",
            "Rosebank",
            "Rustenburg"
        ]

        const kzn_areas = [
            "Pietermaritzburg",
            "Umhlanga",
            "Amazimtoni",
            "Scottburgh",
            "Durban North",
            "Pinetown"
        ]

        const free_state_areas = [
            "Bloemfontein"
        ]

        const north_west_province_areas = [
            "Potchefstroom"
        ]

        const northern_cape_areas = [
            "Kimberly"
        ]

        //RESUME HERE TODAY: why does registration work only when a value is hard coded?
        return(
            <div className="registration">
                <img className="logo"/><br/>
                <input onChange={this.GetName} placeholder="Name" /><br/>
                <input onChange={this.GetPassword}placeholder="Password" /><br/>
                <input onChange={this.GetID} placeholder="ID number" /><br/>
                <input onChange={this.GetPhone} placeholder="Mobile number"  /><br/>
                <input onChange={this.GetEmail} placeholder="Email" id="inEmail" /><br/> {/*type="email"*/}
                <input onChange={this.GetAccountNum} placeholder="Bank account number" /><br/>
                <input onChange={this.GetUniversity} placeholder="University" /><br/>
                <input onChange={this.GetCourseName} placeholder="Course name" /><br/>
                <label>Date of birth</label><br/>
                <input type="date" onChange={this.GetDateOfBirth}/><br/><br/>
                <select onChange={this.GetArea}>
                    <optgroup label="Western Cape">
                        {western_cape_areas.map(area => (
                            <option key={"wc-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="Eastern Cape">
                        {eastern_cape_areas.map(area => (
                            <option key={"ec-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="Gauteng">
                        {gauteng_areas.map(area => (
                            <option key={"gt-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="KwaZulu-Natal">
                        {kzn_areas.map(area => (
                            <option key={"kzn-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="Free State">
                        {free_state_areas.map(area => (
                            <option key={"fs-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="North West Province">
                        {north_west_province_areas.map(area => (
                            <option key={"nwp-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    <optgroup label="Northern Cape">
                        {northern_cape_areas.map(area => (
                            <option key={"nc-"+area}>{area}</option>            
                        ))}
                    </optgroup>
                    
                </select><br/><br/>

                <button onClick={() => this.Register()}>Register</button>
                <button onClick={this.ToggleRegistration}>Back to login</button>
            </div>
        )
    }

    NewLogComps(){
        return(
            <div className="newLogBox">
                <input onChange={this.GetStudName} placeholder="Student name"/><br/>
                <label htmlFor="inHours">(indicate partial hours with a '.' eg: 150 mins = 2.5 hours)</label><br/>
                <input id="inHours" onChange={this.GetHours} placeholder="Hours"/><br/>
                <select onChange={this.GetType}>
                    <option>face to face</option>
                    <option>online</option>
                </select><br/><br/>
                <input id="lessonDate" type="date" onChange={this.GetLessonDate}/><br/><br/>
                <Button variant="primary" onClick={() => this.SubmitLog()}>Submit log</Button>

            </div>
        )
    }

    SetDefaultDate(){

    }

    UserManager(){
        return(     
            <div className="userManager">              
                <select onChange={this.GetUnapprovedUser} placeholder="Select tutor">
                    <option>Select name</option>             
                {(this.unapprovedUsers).map(user => (
                            <option key={user.name}>{user.name}</option>
                        ))}
                </select>
            </div>
        );
    }

    GetUnapprovedUser = (event) =>{
        this.unapprovedTutorName = event.target.value;
        console.log("USER SELECTED: ", this.unapprovedTutorName);
    }

    async ViewJobs(){  
        if(!this.state.viewJobsToggle){ //if user not currently on job viewer... fetch jobs and show it to them using viewJobsToggle as true
            api.get('/jobs', {})
            .then((res) => {
                console.log("ViewJobs() retrieved: ", res.data.jobs);
                this.setState({jobs: res.data.jobs , jobsRetrieved: true , viewJobsToggle: true})
            })

        } else { //else if user is on job viewer... go back to the job viewer using viewJobsToggle as false
            this.setState({viewJobsToggle: false});
        }

    }
    

    async SubmitLog(){
        let date = new Date(this.lessonDate).toISOString();
        console.log(date);

        let validationRes = await this.ValidateLog();
        //console.log("VALIDATION RES: "+validationRes);

        if(validationRes[1].length <= 1){
            await axios.post('/log/add',{},{
                headers: {
                    'lesson_date': date,
                    'hours': this.lessonDuration,
                    'student_name': this.lessonStudent,
                    'tutor_name': this.state.name,
                    'lesson_type': this.lessonType
                }
            })
            .then((res) => {
                //console.log("SubmitLog() result: "+JSON.stringify(res.data.result));
                //console.log("_id: "+res.data.result._id);     WORKS

                let logs = new Array(this.state.logs);
                logs.push(res.data.result);
                            
                //this.setState({addLogToggle: false , logs: logs});
                this.setState({addLogToggle: false});
            })
            .then(async() => {
                await this.GetLogs();
            })
        } else {
            alert("Invalid input provided!\n\n"+validationRes[1]);
        }
        //api.post('/log/'+date+'/'+this.lessonDuration+'/'+this.lessonStudent+'/'+this.state.name+'/'+this.lessonType, {})

   
    }

    async ValidateLog(){
        let validated = true;
        let outputMsg = "";
        const MIN_LESSON_DURATION = 0.1;
        const INVALID_INPUT_MESSAGES = ["Lesson duration must be at least 0.1 hours long and must contain only numbers and periods\n\n",
        "Student name must contain only letters and be at least 2 letters long\n\n"];

        let nameRegex = new RegExp(/^[a-zA-Z]{2,}$/);
        let durationRegex = new RegExp(/^[0-9.]/);

        if((this.lessonDuration < MIN_LESSON_DURATION) || (!durationRegex.test(this.lessonDuration))) {
            validated = false;
            outputMsg += INVALID_INPUT_MESSAGES[0];
        } 
        if(!nameRegex.test(this.lessonStudent)) {
            validated = false;
            outputMsg += INVALID_INPUT_MESSAGES[1];
        }

        return [validated, outputMsg];

    }

    //WORKING
    async ViewUnapprovedUsers(){
        await api.get('/users/unapproved', {})
        .then((res) => {
            //console.log("UNAPPROVED\n");
            //console.log(res.data.result.length);
            
            
            if(res.data.result.length > 0){
                //alert(res.data.result.length);        displays correctly
                this.unapprovedUsers = Array.from(res.data.result);
                //this.pendingUserCount = Array.from(this.unapprovedUsers).length;
                //alert("Users awaiting approval: ", Array.from(res.data.result).length);    //shows correctly
                console.log("UNAPPROVED USERS:"+this.unapprovedUsers.length);
            } else {
                alert("No users awaiting approval at this time");
            }
            
       
        })
    }

    async ToggleUserManager(){
                    //if unapproved users havent been fetched
        await this.ViewUnapprovedUsers();  //wait for them to be fetched and assigned to class attributes       

        if(this.unapprovedUsers.length > 0){ //if user is on the user manager page and there are users awaiting approval
            this.setState({manageUsersToggle: !this.state.manageUsersToggle , unapprovedUsersRetrieved: true})
        } else {
            //alert("No users awaiting approval at this time");
            this.setState({unapprovedUsersRetrieved: true})
        }
        
    }

    async ApproveUser(){
       await api.post('/approve/'+this.unapprovedTutorName, {})
       .then((res) => {
        console.log("User approval response:\n", res.data);
        this.unapprovedTutorName = "";
       })
    }

    GetStudName = (event) => {
        this.lessonStudent = event.target.value;
        console.log("Lesson student: ", this.lessonStudent);
    }

    GetHours = (event) => {
        this.lessonDuration = event.target.value;
        console.log("Lesson duration: ", this.lessonDuration);
    }

    GetType = (event) => {
        this.lessonType = event.target.value;
        console.log("Lesson type: ", this.lessonType);
    }

    GetLessonDate = (event) => {
        this.lessonDate = event.target.value;
        console.log('Lesson date: ', this.lessonDate);
    }

    ToggleRegistration(){
        if(this.registerToggle) this.registerToggle = false;
        else this.registerToggle = true;
        
        this.setState({registrationToggled: this.registerToggle} , () => {
            console.log("Registration toggled: "+this.state.registrationToggled);
        })
        
    }

    GetName = (event) => {
        this.name = event.target.value;
        console.log("Name: "+this.name.trim());
    }

    GetPassword = (event) => {
        this.password = event.target.value;
        console.log("Password: "+this.password.trim());
    }

    GetID = (event) => {
        this.ID = event.target.value;
        console.log("ID number: "+this.ID.trim());
    }

    GetPhone = (event) => {
        this.phoneNum = String(event.target.value).replace(/ /g, '');
        console.log("Mobile number: "+this.phoneNum.trim());
    }

    GetEmail = (event) => {
        this.email = event.target.value;
        console.log("Email: "+this.email.trim());
    }

    GetAccountNum = (event) => {
        this.accountNum = event.target.value;
        console.log("Bank account number: "+this.accountNum.trim());
    }

    GetUniversity = (event) => {
        this.university = event.target.value;
        console.log("University: "+this.university.trim());
    }

    GetCourseName = (event) => {
        this.courseName = event.target.value;
        console.log("Course name: "+this.courseName.trim());
    }

    GetDateOfBirth = (event) => {
        this.dateOfBirth = event.target.value;
        console.log("Date of birth: "+this.dateOfBirth);
    }

    GetArea = (event) => {
        this.area = event.target.value;
        console.log("Area: "+this.area);
    }

    async LogIn(){

        //make call to backend endpoint

        //let response = await api.post('/login/'+this.name+'/'+this.password, {});
        
        let secret = "LUBBEDANI2000";
        let encrypted = CryptoJS.AES.encrypt(this.password, secret).toString();
        //let response = await axios.post('http://localhost:3000/login', {}, {
        let response = await axios.post('/login', {}, {
            headers:{
            'name': this.name,
            'password': encrypted
            }
        })

        let json = response.data;
        console.log(json.token);
        //console.log(response);

        
        if(json.token != "NA"){ //if user was found and token was generated for them...
        //if("error_msg" in json){  
            let token = json.token;
            let token_str = "Bearer "+token;
            //alert("token string:\n"+token_str); //shows correct info         
            
            //let verificationResponse = await api.get('/decode' , {
            let verificationResponse = await axios.get('/decode' , {
                headers: {
                    authorization: token_str
                }
            })
            
            //console.log(verificationResponse.data.token.name);
            
            if(verificationResponse.data.token.name !== ""){ //if token verified and decoded...
                alert(verificationResponse.data.token.name +" logged in!");

                //fetch logs for logged in user here               
    
                //save logged in user's information and generated token to state. Forces page to re-render and show new display now that name has been saved to state
                this.setState({
                    name: verificationResponse.data.token.name,
                    token: json.token,
                    role: verificationResponse.data.token.role,                
                } , async() => {
                    alert("state.name: "+this.state.name+"\nstate.token: "+this.state.token+"\nstate.role: "+this.state.role)
                    
                    await this.GetLogs(this.state.token);
                })

            } else {
                alert("Login failed! Could not decode token.");
            }
            
         
        }
        else {
            alert("Login failed! Please check the submitted name and password.");
        }
        
        
    }
    
    async Register(){
        
        if(this.Validate()){
            console.log("Accepted!");

            let encryptedAccNum = "";

            await this.Encrypt(this.accountNum).then((res) => {
                encryptedAccNum = res;
                console.log("ENCRYPTED ACC NUM: "+res);
                    this.Encrypt(this.password).then((res) => {
                        console.log("ENCRYPTED PASSWORD: "+res);
                        axios.post('/register', {}, {    
                            headers: {
                                //'Access-Control-Allow-Origin' : "http://localhost:8000"
                                'name' : this.name,
                                'password' : (res),
                                'ID' : this.ID,
                                'phone_no': this.phoneNum,
                                'email': this.email,
                                'account_no': encryptedAccNum,
                                'university': this.university,
                                'course_name': this.courseName,
                                'date_of_birth': this.dateOfBirth,
                                'role': 'tutor',
                                'area': this.area 
                
                            }
                        })
                        .then((res) => {
                            console.log(res);
                        })
                    })
            })

            //api.get('http://localhost:3000/logs/Dani%20Lubbe', {})
           
        } //else alert("Invalid form data entered!")        

        //await axios.post('http://localhost:3000/register/'+this.name+'/'+this.password+'/'+this.ID+'/'+this.phoneNum+'/'+this.email+'/'+this.accountNum+'/'+this.university+'/'+this.courseName+'/'+this.dateOfBirth+'/'+this.area, {}, {
       
    }

    async Encrypt(plaintext){
        const SECRET_KEY = "LUBBEDANI2000";
        let encrypted = CryptoJS.AES.encrypt(plaintext, SECRET_KEY);

        return encrypted.toString();
    }

    
    Validate(){
        let validated = true;
        const ID_LENGTH = 13;
        const PHONE_LENGTH = 10;

        /* REGEX PATTERN REFERENCED FROM
        https://www.youtube.com/watch?v=QxjAOSUQjP0 */
        const EMAIL_REGEX = new RegExp(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,15})(\.[a-z]{2,8})?$/);

        const INVALID_INPUT_MESSAGES = ["ID number must be 13 digits long\n\n", 
        "Mobile number must be 10 digits long\n\n", 
        "Email address must contain a name consisting of alphanumeric characters, an '@' symbol, a domain of between 2 and 15 alphanumeric characters, and an extension of between 2 and 8 alphanumeric characters\nEg; myname@testdomain.com\n\n"];

        let outputMsg = ""; 

        if(this.ID.length !== ID_LENGTH){
            outputMsg += INVALID_INPUT_MESSAGES[0];
            console.log("Invalid ID");
            validated = false;
        }
        if(!EMAIL_REGEX.test(this.email)){
            outputMsg += INVALID_INPUT_MESSAGES[2];
            console.log("Invalid email");
            validated = false;
        }
        if(this.phoneNum.length !== PHONE_LENGTH){
            outputMsg += INVALID_INPUT_MESSAGES[1];
            console.log("Invalid mobile number");
            validated = false;
        }

        if(!validated) alert("Invalid information provided!\n\n"+outputMsg);
        //this.VerifyAge();

        return validated;
    }

    /*
    VerifyAge(){
        let verified = true;
        let today = new Date();
        //console.log(this.dateOfBirth);
        let birthday = String(this.dateOfBirth).replace(/-/g, ''); //.replace(/ /g, '')
        console.log(birthday);

        birthday = "20230405";
        const BIRTH_YEAR = birthday.substring(0, 4);
        const BIRTH_MONTH = birthday.substring(5, 2); //WHY WILL THIS NOT WORK???
        const BIRTH_DAY = birthday.substring(7);

        console.log("YEAR: "+BIRTH_YEAR+"\nMONTH: "+BIRTH_MONTH+"\nDAY: "+BIRTH_DAY);       

        return verified;
    }
    */
    

    async GetLogs(){
         //first decode token from state, verify and decode and check for name
         let token_str = "Bearer "+this.state.token;        

         //let token = await token_decode_response.json();
         //let decoded_token = verificationResponse.data.token;
         //alert(verificationResponse.data);

         let logsResponse = await axios.get('/logs/'+this.state.name , {
            headers: {
                authorization: token_str
            }
        })

        
        if("message" in logsResponse) console.log("LOGS RESPONSE: \n"+logsResponse.data.logs[0].date);
        else  console.log("LOGS RESPONSE: \n"+logsResponse.data.message); 
        //console.log("LOGS RESPONSE: \n"+logsResponse.data.logs[0].date);       Shows correct info
        //console.log("LOGS RESPONSE: \n"+logsResponse.data.message);       shows corrrect message when logs not found   

        //let testLog = {"logs":[{"_id":"test","date":"Sun Nov 20 2022 02:00:00 GMT+0200 (South Africa Standard Time)","hours":4,"student_name":"sgf","tutor_name":"Dani adddaLubbe","lesson_type":"faceOtoface"}]};
        
        if(logsResponse.message === "No logs found"){
            this.setState({
                logs: 1
            })   
        } else {
                this.setState({
                logs: logsResponse.data
            }) 
        }                   

    }

    async AddLog(){
        if(this.state.addLogToggle)
            this.setState({addLogToggle: false});
        else this.setState({addLogToggle: true});
    }

    FormatDate(logDate){
        console.log("Formatting: ", logDate);
        console.log("Extracted date: ", logDate.substr(0, 14));
        let shortenedDate = logDate.substr(0, 10);
        console.log("Day of the week: "+shortenedDate.substr(0, 3)+"\nDate: "+shortenedDate.substr(4));
        return shortenedDate;
    }

}