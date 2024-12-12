import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../style.css';
import emailjs from 'emailjs-com';

const ForgotPasswordBox = () =>{
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confermPassword, setConfermPassword] = useState('');
    const [code, setCode] = useState('');
    const [trueCode, setTrueCode] = useState('');
    const [phase,setPhase] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const changePassword = async ()=>{
        const changePw = await fetch(`http://localhost:8081/api/5/users/changePassword`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Email': email,
                'NewPassword': password
            }
        })
        .then(response=>response.status==200 || response.status==201?(() => { alert("Password Changed Successfully ") })():(() => { throw new Error('Something went wrong'); })())
        .catch((error)=>console.log(error));
    }
    const getUsername = async ()=>{
        let returnValue = null;
        const userFetched = await fetch(`http://localhost:8081/api/5/users/getUsername`,{
            method: "GET",
            headers:{
                'Email': email
            }
        })
        .then(Response=>Response.status==200 || Response.status==201? (() => { return Response.json() })():(() => { throw new Error('Something went wrong');})())
        .then((data)=>{
            console.log("before");
            setUsername(data.userName);
            setErrorMessage('');
            returnValue = true;
        })
        .catch(error=>{
            setErrorMessage("This email isn't regesterd in the system");
            returnValue = false;
        });
        return returnValue;
    }

    const generateCode = ()=>{
        let generatedCode = '';
        const characters = '0123456789';
        for (let i = 0; i < 4; i++) {
            generatedCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return (generatedCode);
    }

    const sendCode = async (e)=>{
        e.preventDefault();
        let u = await getUsername()
        let c = generateCode();
        console.log(c)
        setTrueCode(c);
        console.log(u);
        if (u){
            // removed after uncommenting
            setPhase(2);
            // emailjs
            //     .send(
            //         'service_j4cifp3', // Replace with your EmailJS Service ID
            //         'template_zlx3hfj', // Replace with your EmailJS Template ID
            //         {email: email, to_name: u, code: c},
            //         '6nj8Z27gLH-R_ZFsc' // Replace with your EmailJS User ID
            //     )
            //     .then(
            //         (result) => {
            //             console.log('Email sent successfully!');
            //             setPhase(2);
            //         },
            //         (error) => {
            //             alert('Failed to send email.');
            //         }
            //     );
            }
    }
    const checkCode = (e)=>{
        e.preventDefault()
        if (trueCode == code){
            setPhase(3);
            setErrorMessage("");
        }
        else
            setErrorMessage("Wrong Code, Try again or click resend");
    }
    const checkPassword = async (e)=>{
        e.preventDefault()
        if (password == confermPassword){
            setErrorMessage('');
            await changePassword();
            navigate('/login');
        }else{
            setErrorMessage("Confermed password doesn't match with the enterd password");
        }
    }

    return(
        <div className="formBox">
            <header>Forgot Password</header>
            {phase==1 && (
                <form id="emailForm" onSubmit={sendCode}>
                    <label htmlFor='email'><b>Email</b></label>
                    <input type="email" name='email' placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>
                    <button className="loginButton" type="submit" form="emailForm">Send Code</button>
                </form>
            )}
            {phase==2 && (
                <form id="codeForm" onSubmit={checkCode}>
                    <p style={{fontSize:'1rem'}}>{username} we have sent you a code of 4 characters on your email, please check your inbox (or your spam).</p>
                    <label htmlFor="code"><b>Code</b></label>
                    <input type="text" name='code' placeholder="Enter Code" value={code} onChange={(e)=>setCode(e.target.value)} required></input>
                    <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>
                        <button className="resendCodeLink" onClick={sendCode}>Resend code</button>
                    </div>
                    <button className="loginButton" form="codeForm" type="submit">Conferm Code</button>
                </form>
            )}
            {phase==3 && (
                <form id="changePasswordForm" onSubmit={checkPassword}>
                    <label htmlFor="password"><b>Password</b></label>
                    <input type="password" name='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" required></input>
                    {/(?=.*[a-z])/.test(password) ?
                        <p style={{color: 'green', fontSize:'1rem'}}>• at least one lowercase letter is present.</p> :
                        <p style={{color: 'black', fontSize:'1rem'}}>• at least one lowercase letter is present.</p>
                    }
                    {/(?=.*[A-Z])/.test(password) ?
                        <p style={{color: 'green', fontSize:'1rem'}}>• at least one uppercase letter is present.</p> :
                        <p style={{color: 'black', fontSize:'1rem'}}>• at least one uppercase letter is present</p>
                    }
                    {/(?=.*\d)/.test(password) ?
                        <p style={{color: 'green', fontSize:'1rem'}}>• at least one digit is present.</p> :
                        <p style={{color: 'black', fontSize:'1rem'}}>• at least one digit is present.</p>
                    }
                    {/(?=.*[@$!%*?&])/.test(password) ?
                        <p style={{color: 'green', fontSize:'1rem'}}>• at least one special character from the set @$!%*?& is present.</p> :
                        <p style={{color: 'black', fontSize:'1rem'}}>• at least one special character from the set @$!%*?& is present.</p>
                    }
                    {/[A-Za-z\d@$!%*?&]{8,}/.test(password) ?
                        <p style={{color: 'green', fontSize:'1rem'}}>• at least 8 characters.</p> :
                        <p style={{color: 'black', fontSize:'1rem'}}>• at least 8 characters.</p>
                    }
                    <label htmlFor="confermPassword"><b>Conferm Password</b></label>
                    <input type="password" name='confermPassword' placeholder="Conferm Password" value={confermPassword} onChange={(e)=>setConfermPassword(e.target.value)} pattern={password} required></input>
                    <p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>
                    <button className="loginButton" form="changePasswordForm" type="submit">Conferm Password</button>
                </form>
            )}
            
        </div>
    );
};
export default ForgotPasswordBox;
