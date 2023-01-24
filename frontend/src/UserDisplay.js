export default function UserDisplay(props){
    let name = props.name;
    let ID = props.ID;
    let phone_no = props.phone_no;
    let email = props.email;
    let account_no = props.account_no;
    let university = props.university;
    let course_name = props.course_name;
    let date_of_birth = props.date_of_birth;
    let role = props.role;
    
    return(
        <div>
            <h1>{name}</h1><br/>
            <h2>{ID}</h2><br/>
            <h3>Phone number: {phone_no}</h3><br/>
            <h3>Email: {email}</h3><br/>
            <h3>Bank account number: {account_no}</h3><br/>
            <h3>University: {university}</h3><br/>
            <h3>Course: {course_name}</h3><br/>
            <h3>Date of birth: {date_of_birth}</h3><br/>
            <h3>Role: {role}</h3><br/>
        </div>
    )
}