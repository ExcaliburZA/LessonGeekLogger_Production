import React from "react";
import { Button } from "react-bootstrap";
import '../App.css';
import { api } from "../api";
import axios from "axios";

export default class JobBoard extends React.Component {
    comment = "";

    constructor(props){
        super(props);
        this.id = props.job._id;
        this.grade = props.job.grade;
        this.subject = props.job.subject;
        this.area = props.job.area;
        this.desc = props.job.desc;        
        this.studentName = props.job.student_name;

        console.log(props.job._id+" : "+props.job.tutor_name);

        this.tutorName = props.tutor_name;
        this.acceptedTutor = props.job.tutor_name;

        let accepted  = true;
        if(this.acceptedTutor == "") //if no tutor has accepted this job, set accepted to false
            accepted = false;
        
        this.state = {accepted: accepted , likes: props.job.likes , comments: props.job.comments , commentFormToggle: false};


        this.AddComment = this.AddComment.bind(this); 
        this.ToggleCommentForm = this.ToggleCommentForm.bind(this);     
        this.GetComment = this.GetComment.bind(this);
        this.CommentForm = this.CommentForm.bind(this);
    }

    //WORKING
    async AddLike(){
        await api.post('/job/'+this.id+'/like' , {})
        .then((res) => {
            console.log("New like count: " , res.data.likes);
            this.setState({likes:  res.data.likes});
        })
    }


    //WORKING
    async AcceptJob(){
       await api.post('/job/'+this.id+'/accept/'+this.tutorName, {})
       .then((res) => {
            console.log("Updated document:\n", res.data);
            this.acceptedTutor = this.tutorName;
            this.setState({accepted: true});
       })
    }

    //why does this hide the job board?
    ToggleCommentForm(){
        if(this.state.commentFormToggle){
            this.setState({commentFormToggle: false} , console.log("Toggled comnment form OFF"));
        } else {
            this.setState({commentFormToggle: true} , console.log("Toggled comnment form ON"));
        }      
    }


    async AddComment(){
        await axios.post('http://localhost:3000/job/'+this.id+'/comment', {} ,{
            headers: {
                'comment' : this.comment ,
                'author' : this.tutorName
            }
        })
        .then((res) => {
            //console.log(res.data.newDoc.comments);
            let comments = Array.from(this.state.comments);
            comments.push(res.data.newDoc.comments[res.data.newDoc.comments.length-1]);
            this.setState({commentFormToggle: false , comments});
        })
    }

    CommentForm(){ 
        return(
            <div className="comment-form">
                {console.log("comment form rendering!")}
                <input id="comment-input" onChange={this.GetComment} placeholder="Type your response here"></input><br/>
                <Button variant="primary" onClick={async() => await this.AddComment()}>Submit</Button>
            </div>
        )
    }

    GetComment = (event) => {
        this.comment = event.target.value;
        console.log("Comment: ", this.comment);
    }

    render(){ //add check to see if commentToggle is enabled, if so display comment adding form instead of log
        let parsedComments = Array.from(this.state.comments);
        //console.log("Parsed comments: "+parsedComments.length); displays correctly
        if(this.state.commentFormToggle){
            return(
            <div className="job-box">                
                <h1 className="jobHeading">Grade {this.grade} {this.subject} - {this.area}</h1><hr className="lineStyle"></hr>
                <h2 className="jobStudentName">{this.studentName}</h2><hr className="lineStyle"></hr>
                <h3 className="jobDesc">{this.desc}</h3><hr className="lineStyle"></hr>
                <h2 className="jobLikes">Likes: {this.state.likes}</h2>
                {(this.acceptedTutor != "") ? <h3>Accepted by: {this.tutorName}</h3> : <h3>Job Available</h3>}
                {(this.acceptedTutor == "") ? <Button variant="primary" onClick={async() => await this.AcceptJob()}>Accept</Button> : null}
                <Button variant="primary" onClick={async() => await this.AddLike()}>Like</Button>
                
                <this.CommentForm />
                <Button variant="primary" onClick={() => this.ToggleCommentForm()}>Back</Button>
            </div>
            )
        } else{
            return(
                <div className="job-box">                
                    <h1 className="jobHeading">Grade {this.grade} {this.subject} - {this.area}</h1><hr className="lineStyle"></hr>
                    <h2 className="jobStudentName">{this.studentName}</h2><hr className="lineStyle"></hr>
                    <h3 className="jobDesc">{this.desc}</h3><hr className="lineStyle"></hr>
                    <h2 className="jobLikes">Likes: {this.state.likes}</h2>
                    {(this.acceptedTutor != "") ? <h3>Accepted by: {this.tutorName}</h3> : <h3>Job Available</h3>}
                    {(this.acceptedTutor == "") ? <Button variant="primary" onClick={async() => await this.AcceptJob()}>Accept</Button> : null}
                    
                    <Button variant="primary" onClick={async() => await this.AddLike()}>Like</Button>
                    
                    <div className="comment-list-div">
                        {parsedComments.map(comment => (
                            <div className="comment-div" key={Math.random()+Math.random()}>
                                <this.CommentItem key={Math.random()+Math.random()} commentBody={comment.comment} author={comment.author}></this.CommentItem>
                                {/*<hr className="lineStyle2"></hr>*/}
                            </div>                                                   
                        ))}
                    </div>
                    <Button variant="primary" onClick={() => this.ToggleCommentForm()}>Comment</Button>
                </div>
            );
        }

    }

    CommentItem(props){
        let comment = props.commentBody;
        let author = props.author;
        return(
            <div className="comment-item">
                <h3>{comment}</h3>
                <h2>{author}</h2>
            </div>
        )
    }
}