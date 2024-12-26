import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import '../style.css';
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'

const AddAdminBox = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTrigger, setErrorTrigger] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { superID } = location.state || {};

    const addAdmin = async (e)=>{
        e.preventDefault()
        if (!phone || !isValidPhoneNumber(phone)){
            setErrorMessage("Phone number is not correct");
            setErrorTrigger("phoneError");
            return;
        }  
        const loginUser = await fetch(`http://localhost:8081/api/v1/system/admin/addAdmin`, {
            
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(
                {
                    'UserName': username,
                    'Password': password,
                    'Phone': phone,
                    'Email': email
                }
            )
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
                <label htmlFor='emain'><b>Email</b></label>
                <input type="email" name='emain' placeholder="Emain" value={username} onChange={(e)=>setEmail(e.target.value)} required></input>
                <label htmlFor="phone"><b>Phone</b></label>
                <PhoneInput className="phoneInput" international placeholder="Enter phone number" value={phone} onChange={setPhone} isValidPhoneNumber required/>
                {errorTrigger == "phoneError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
                <label htmlFor="password"><b>Password</b></label>
                <input type="password" name='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required></input>
                {errorTrigger == "usernameError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
                <button className="loginButton" form="loginForm" type="submit">Add Admin</button>
            </form>
        </div>
    );
};
export default AddAdminBox;
