import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import '../style.css';
import {jwtDecode} from 'jwt-decode';

const AddAdminBox = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTrigger, setErrorTrigger] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { superID } = location.state || {};

    const addAdmin = async (e)=>{
        e.preventDefault()
        console.log({
            'UserName': username,
            'Password': password,
            'SuperID': 12345
        });
        const loginUser = await fetch(`http://localhost:8081/api/6/admin/signup`, {
            method: "POST",
            headers:{
                'UserName': username,
                'Password': password,
                'SuperID': 12345
            }
        })
        .then(response=>{response.status==200 || response.status==201?(() => { setErrorMessage('');alert("Admin added successfully"); })():(() => { throw new Error('Something went wrong'); })()})
        .catch(async (error)=>{
            setErrorMessage('Username already exists in the system');
            setErrorTrigger('usernameError');
        });
    }
    return(
        <div className="formBox">
            <form id="loginForm" onSubmit={addAdmin}>
                <header>Add Admin</header>
                <label htmlFor='username'><b>Username</b></label>
                <input type="text" name='username' placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required></input>
                <label htmlFor="password"><b>Password</b></label>
                <input type="password" name='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required></input>
                {errorTrigger == "usernameError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
                <button className="loginButton" form="loginForm" type="submit">Add Admin</button>
            </form>
        </div>
    );
};
export default AddAdminBox;
