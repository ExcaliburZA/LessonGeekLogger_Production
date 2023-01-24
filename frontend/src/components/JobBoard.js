import React from "react";
import { Button } from "react-bootstrap";
import '../App.css';

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

    async AddLike(){
        fetch('/job/'+this.id+'/like' , {
            method: "POST"
        })
        .then((ret) => {
            ret.json()
            .then((json) => {
                console.log("New like count:\n", json.likes);
                this.setState({likes: json.likes});
            })
        })
    }

    async AcceptJob(){
        fetch('/job/'+this.id+'/accept/'+this.tutorName , {
            method: "POST"
        })
        .then((ret) => {
            ret.json()
            .then((json) => {
                console.log("Updated document:\n", json);
                this.acceptedTutor = this.tutorName;
                this.setState({accepted: true});
            })
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
        console.log("Adding comment for: "+this.id);
        await fetch('/job/'+this.id+'/comment' , {
            method: "POST",
            headers: new Headers({
                comment: this.comment,
                author: this.tutorName
            })
        })
        .then((ret) => {
            ret.json()
                .then((json) => {
                    console.log("Comments:\n", json.newDoc.comments);
                    let comments = Array.from(this.state.comments);
                    comments.push(json.newDoc.comments[json.newDoc.comments.length-1]);
                    this.setState({commentFormToggle: false , comments});
            })
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
                <Button variant="primary" onClick={async() => await this.AcceptJob()}>Accept</Button><Button variant="primary" onClick={async() => await this.AddLike()}>Like</Button>
                <hr className="lineStyle"></hr>
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
                    <Button variant="primary" onClick={async() => await this.AcceptJob()}>Accept</Button><Button variant="primary" onClick={async() => await this.AddLike()}>Like</Button>
                    <hr className="lineStyle"></hr>
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