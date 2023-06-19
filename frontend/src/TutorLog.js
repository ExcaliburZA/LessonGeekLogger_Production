import React from "react";
import './App.css';

export default function TutorLog(props) {
    let date = props.date;
    let hours = props.hours;
    let student_name = props.student_name;
    let tutor_name = props.tutor_name;
    let lesson_type = props.lesson_type;

    /*
    const LogStyle = {
        backgroundColor: 'lightgrey',
        //fontFamily: 'sans-serif',
        textAlign: 'center',
        borderRadius: '15px 50px 15px',
        border: '3px solid black',
        margin: 'auto',
        padding: '12px',
        fontSize: '0.8rem',
        maxWidth: '15%',
        minWidth: '150px',
        marginTop: '20px'
        
    }
    */
  
    /*
        return(
            <div className="container">                
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Drive 2011</h2>
                        <p>Driver is a skilled hollywood stuntman who moonlights as a getaway driver</p>
                    </div>
                </div>
            </div>
        );
        */

        return(
            <div className="logBoxStyle">                
                <h2 className="logHeading">Tutor name: <p className="logName">{tutor_name}</p></h2><hr className="lineStyle"></hr>
                <h2 className="logHeading">Student name:<p className="logName">{student_name}</p></h2><hr className="lineStyle"></hr>
                <h2 className="logHeading">Hours: <p className="logName">{hours}</p></h2><hr className="lineStyle"></hr>
                <h2 className="logHeading">Lesson type: <p className="logName">{lesson_type}</p></h2><hr className="lineStyle"></hr>
                <h2 className="logHeading">Date: <p className="logName">{date}</p></h2>
            </div>
        );
        
}