import { useState, useEffect } from "react";
import { Link, useNavigate} from 'react-router-dom';
import '../style.css';

const LoginBox = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTrigger, setErrorTrigger] = useState('');

    const navigate = useNavigate();


    const login = async (e)=>{
        e.preventDefault()
        const userFetched = await fetch(`http://localhost:8081/users/login`,{
            method: "GET",
            headers: {
                'Email': email,
                'Password': password
            }
        })
        .then(response=>response.status==200 || response.status==201?(() => { return response.json() })():(() => { throw new Error('Something went wrong'); })())
        .then((userData)=>{
            setErrorMessage('');
            navigate('/main', {state: {user: userData}});
        })  
        .catch(async(error)=>{
            setErrorMessage('Wrong email or password');
            setErrorTrigger('emailError');
        }); 
    }
    return(
        <div className="formBox">
            <form id="loginForm" onSubmit={login}>
                <header>Login</header>
                <label htmlFor='email'><b>Email</b></label>
                <input type="email" name='email' placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required></input>
                <label htmlFor="password"><b>Password</b></label>
                <input type="password" name='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required></input>
                {errorTrigger == "emailError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
                <button className="loginButton" form="loginForm" type="submit">Login</button>
            </form>
            <p className="lineWithText"><span>Or</span></p>
            <center>New user? <Link className="signupLink" to="/signup">Signup</Link></center>
        </div>
    );
};
export default LoginBox;
