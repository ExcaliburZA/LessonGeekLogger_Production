import React from "react";
import './App.css';
import TutorLog from "./TutorLog";

import { Button } from "react-bootstrap";
import JobBoard from "./components/JobBoard";
//import UserManager from "./components/UserManager";

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
    lessonDate = "";
    lessonDuration = "";
    lessonType = "face to face";

    unapprovedTutorName = "";
    unapprovedUsers = [];
    pendingUserCount = 0;

    registerToggle = false;
    
    constructor(props){
        super(props);
        this.state = {name: "" , token: "" , logs: null , role: "", registrationToggled: false , addLogToggle: false , manageUsersToggle: false, unapprovedUsersRetrieved: false , viewJobsToggle: false , jobs: [] , jobsRetrieved: false};
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

        this.GetStudName = this.GetStudName.bind(this);
        this.GetLessonDate = this.GetLessonDate.bind(this);
        this.GetType = this.GetType.bind(this);
        this.GetHours = this.GetHours.bind(this);

        this.GetArea = this.GetArea.bind(this);

        this.GetUnapprovedUser = this.GetUnapprovedUser.bind(this);
    }

    componentDidMount(){
        console.log("Component mounted");
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
            } else if(typeof(this.state.logs) == "string"){
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
                        <Button variant="primary" onClick={async() => await this.ApproveUser()}>Approve {this.unapprovedTutorName}</Button> 
                        <Button variant="primary" onClick={async() => await this.ToggleUserManager()}>Return</Button> 
                    </div>
                )
            } else if(this.state.viewJobsToggle){
                let parsedJobs = Array.from(this.state.jobs);               
                return(                   
                    <div>
                        {parsedJobs.map(job => (
                            <JobBoard key={job.grade+"-"+job.student_name+"-"+job.subject} job={job} tutor_name={this.state.name}/>
                        ))}<br/><br/>
                        <Button variant="secondary" onClick={() => this.ViewJobs()}>Return</Button>
                    </div>
                )

            } else {
                console.log("Logs for ",this.state.name+" found! Logs: "+JSON.stringify(this.state.logs.logs));
                console.log("Retrieved logs index 0: ",this.state.logs.logs[0]);
                console.log("Retrieved logs count: ",this.state.logs.logs.length);
                console.log("Type of state.logs.logs: ",typeof(this.state.logs.logs));
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
                <input onChange={this.GetName} placeholder="Name" value="Dani Lubb"/><br/>
                <input onChange={this.GetPassword} placeholder="Password" value="airpops42"/><br/><br/>

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

        return(
            <div className="registration">
                <img className="logo"/><br/>
                <input onChange={this.GetName} placeholder="Name"/><br/>
                <input onChange={this.GetPassword}placeholder="Password"/><br/>
                <input onChange={this.GetID} placeholder="ID number"/><br/>
                <input onChange={this.GetPhone} placeholder="Mobile number"/><br/>
                <input onChange={this.GetEmail} placeholder="Email"/><br/>
                <input onChange={this.GetAccountNum} placeholder="Bank account number"/><br/>
                <input onChange={this.GetUniversity} placeholder="University"/><br/>
                <input onChange={this.GetCourseName} placeholder="Course name"/><br/>
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

                <button onClick={this.Register}>Register</button>
                <button onClick={this.ToggleRegistration}>Back to login</button>
            </div>
        )
    }

    NewLogComps(){
        return(
            <div className="newLogBox">
                <input onChange={this.GetStudName} placeholder="Student name"/><br/>
                <label for="inHours">(indicate partial hours with a '.' eg: 150 mins = 2.5 hours)</label><br/>
                <input id="inHours" onChange={this.GetHours} placeholder="Hours"/><br/>
                <select onChange={this.GetType}>
                    <option>face to face</option>
                    <option>online</option>
                </select><br/><br/>
                <input type="date" onChange={this.GetLessonDate}/><br/><br/>
                <Button variant="primary" onClick={() => this.SubmitLog()}>Submit log</Button>

            </div>
        )
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
            fetch('/jobs' , {
                method: "GET",
            })
            .then((res) => {
                res.json()
                .then((val) => {
                    console.log("ViewJobs() retrieved: ", val.jobs);
                     this.setState({jobs: val.jobs , jobsRetrieved: true , viewJobsToggle: true}) //save jobs to state and update state to indicate that jobs have been retrieved
                })
            }) 
        } else { //else if user is on job viewer... go back to the job viewer using viewJobsToggle as false
            this.setState({viewJobsToggle: false});
        }

    }
    

    async SubmitLog(){
        let date = new Date(this.lessonDate).toISOString();
        
        let response = await fetch('/log/'+date+'/'+this.lessonDuration+'/'+this.lessonStudent+'/'+this.state.name+'/'+this.lessonType , {
            method: "POST",
        })

        let json = await response.json();
        console.log("Result: ",json.result);

        //let logs = new Array(this.state.logs);
        //logs.push(json.result);
        this.setState({addLogToggle: false});
        await this.GetLogs();
        //this.setState({logs: logs , addLogToggle: false})
        
    }

    //WORKING
    async ViewUnapprovedUsers(){
        await fetch('/users/unapproved', {
            method: "GET"
        }).then((res) => res.json())
        .then((res) => {
            if(res.message !== "no pending approvals"){
                this.unapprovedUsers = res.users;
                this.pendingUserCount = this.unapprovedUsers.length;
                console.log("Users awaiting approval: ", this.unapprovedUsers.length);    //shows correctly
            } else {
                console.log("No users awaiting approval at this time");
            }
       
        })
    }

    async ToggleUserManager(){
                    //if unapproved users havent been fetched
        await this.ViewUnapprovedUsers();  //wait for them to be fetched and assigned to class attributes       

        if(this.pendingUserCount > 0){ //if user is on the user manager page and there are users awaiting approval
            this.setState({manageUsersToggle: !this.state.manageUsersToggle , unapprovedUsersRetrieved: true})
        } else {
            alert("No users awaiting approval at this time");
            this.setState({unapprovedUsersRetrieved: true})
        }
        
    }

    async ApproveUser(){
        await fetch('/approve/'+this.unapprovedTutorName ,{
            method: "POST"
        }).then((result) => {
            console.log("User approval response:\n", result);
            this.setState({manageUsersToggle: false}, () => console.log("Returning to log viewer..."));
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
        console.log("Name: "+this.name);
    }

    GetPassword = (event) => {
        this.password = event.target.value;
        console.log("Password: "+this.password);
    }

    GetID = (event) => {
        this.ID = event.target.value;
        console.log("ID number: "+this.ID);
    }

    GetPhone = (event) => {
        this.phoneNum = event.target.value;
        console.log("Mobile number: "+this.phoneNum);
    }

    GetEmail = (event) => {
        this.email = event.target.value;
        console.log("Email: "+this.email);
    }

    GetAccountNum = (event) => {
        this.accountNum = event.target.value;
        console.log("Bank account number: "+this.accountNum);
    }

    GetUniversity = (event) => {
        this.university = event.target.value;
        console.log("University: "+this.university);
    }

    GetCourseName = (event) => {
        this.courseName = event.target.value;
        console.log("Course name: "+this.courseName);
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
        let response = await fetch('/login/'+this.name+'/'+this.password , {
            method: "POST"
        });

        //parse response from backend call as JSON
        let json = await response.json();

        if(json.token !== "NA"){ //if user was found and token was generated for them...
            let token = json.token;
            let token_str = "Bearer "+token;

            //making a call to the backend token verification endpoint
            let verificationResponse = await fetch('/decode' , {
                method: "GET",
                headers: new Headers({
                    authorization: token_str
                })
            });

            //parsing backend response as JSON and retrieving the decoded user token from it
            json = await verificationResponse.json();
            let decoded_token = json.token; 

            if(decoded_token.name !== ""){ //if token verified and decoded...
                alert(decoded_token.name +" logged in!");

                //fetch logs for logged in user here               
    
                //save logged in user's information and generated token to state. Forces page to re-render and show new display now that name has been saved to state
                this.setState({
                    name: decoded_token.name,
                    token: token,
                    role: decoded_token.role,                
                } , async() => {
                    await this.GetLogs(token);
                })

            } else {
                alert("Login failed! Could not decode token.");
            }
         
        }
        else {
            alert("Login failed! Please check the submitted name and password.");
        }
        
    }
    
    //RESUME HERE TODAY
    //fix SyntaxError: Unexpected end of JSON input error
    async Register(){
        fetch('/register/'+this.name+'/'+this.password+'/'+this.ID+'/'+this.phoneNum+'/'+this.email+'/'+this.accountNum+'/'+this.university+'/'+this.courseName+'/'+this.dateOfBirth+'/'+this.area , 
        {
            method: "POST"
        })
        .then((ret) => {
            ret.json()
            .then(async(json) => {
                if(json.token !== "NA"){ //if user was found and token was generated for them
                    let token = json.token;
                    let token_str = "Bearer "+token;
        
                    await fetch('/decode' , {
                        method: "GET",
                        headers: new Headers({
                            Authorization: token_str
                        })
                    }).then((decode_res) => {
                        decode_res.json()
                        .then((json) => {
                            let decoded_token = json.token; 

                            if(decoded_token.name !== ""){
                            alert(decoded_token.name +" registered and logged in!");
            
                            this.setState({
                                name: decoded_token.name,
                                token: token,
                                role: decoded_token.role,                
                            }, async() => {
                                await this.GetLogs(token);
                            })
                        } else alert("Login failed! Could not decode token.")
                        });                                    

                    })
        

                } else alert("Registration failed!")
            })
        })

        //gen token and save it to state to log the new user in
        

    }

    async GetLogs(token){
         //first decode token from state, verify and decode and check for name
         let token_str = "Bearer "+token;        

         let token_decode_response = await fetch('/decode', {
            method: "GET",
            headers: new Headers({
                Authorization: token_str
            })
         })

         let json = await token_decode_response.json();
         
         if(json.name !== ""){ //if token was verified and decoded correctly 
            
            let response = await fetch('/logs/'+this.state.name , {
                method: "GET"         
            });

            //parsing backend response as JSON and echoing the result to console
            await response.json()
            .then((value) => {
                //console.log("Logs parsed from json: ",value.logs.length);
                json = value;
            });

            //let testLog = {"logs":[{"_id":"test","date":"Sun Nov 20 2022 02:00:00 GMT+0200 (South Africa Standard Time)","hours":4,"student_name":"sgf","tutor_name":"Dani adddaLubbe","lesson_type":"faceOtoface"}]};
            
            if(json.message === "No logs found"){
                this.setState({
                    logs: "none"
                })   
            } else {
                    this.setState({
                    logs: json
                }, () => {
                    //console.log("State logs saved: ",JSON.stringify(this.state.logs));     
                    //this.render();
                }) 
            }

            //saving the retreived logs to component state
    
            
            /* CALLS BEFORE RENDER METHOD MESSAGE IS DISPLAYED
            this.setState({role: "test"} , 
                console.log("role: ",this.state.role)
            )
            */

         } else {
            alert("JWT token verification failed!\nMethod: GetLogs(token)");
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