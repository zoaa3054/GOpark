import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'
import emailjs from 'emailjs-com';


const SignupBox = () =>{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confermPassword, setConfermPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [carID, setCarID] = useState("");
    const [gender, setGender] = useState("UNKNOWN");
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTrigger, setErrorTrigger] = useState('');
    const [phase, setPhase] = useState(1);
    const [code, setCode] = useState('');
    const [trueCode, setTrueCode] = useState('');
    const navigate = useNavigate();

      
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
        let c = generateCode();
        console.log(c)
        setTrueCode(c);
        if (phone && isValidPhoneNumber(phone)){  
            // // should be removed after uncommenting                  
            // setPhase(2);
            emailjs
                .send(
                    'service_j4cifp3', // Replace with your EmailJS Service ID
                    'template_zlx3hfj', // Replace with your EmailJS Template ID
                    {email: email, to_name: username, code: c},
                    '6nj8Z27gLH-R_ZFsc' // Replace with your EmailJS User ID
                )
                .then(
                    (result) => {
                        console.log('Email sent successfully!');
                        setPhase(2);
                    },
                    (error) => {
                        alert('Failed to send email.');
                    }
                );
        }else{
            setErrorMessage("Phone number is not correct");
            setErrorTrigger("phoneError");
        }
    }

    const checkCode = (e)=>{
        e.preventDefault()
        if (trueCode == code){
            setPhase(1);
            setErrorMessage("");
            signup()
        }
        else
            setErrorMessage("Wrong Code, Try again or click resend");
    }

    const signup = async ()=>{
        const register = await fetch(`http://localhost:8081/users/signUp`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'driverUserName': username,
                'emailAddress': email,
                'password': password,
                'phoneNumber': phone,
                'carPlateNumber': carID
            })
         })
        .then(response=>response.status==200 || response.status==201?(() => { return response.json() })():(() => { throw new Error('Something went wrong'); })())
        .then((userData)=>{
            console.log(userData);
            navigate('/main', {state:{user: userData}});
        })
        .catch(error=>{
            setErrorMessage("Email already exists");
            setErrorTrigger("emailError");
        });
    }
    
    return(
        <div className="formBox">
            {phase==1 &&(
                <form id="signupForm" onSubmit={sendCode}>
                    <header>Signup</header>
                    <label htmlFor='username'><b>Username</b></label>
                    <input type="text" name='username' placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required></input>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" name='email' placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required></input>
                    {errorTrigger == "emailError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
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
                    {confermPassword == password ?
                        <></> :
                        <p style={{color: 'red', fontSize:'1rem'}}>Conferm password doesn't match the enterd password</p>
                    }
                    <label htmlFor="carID"><b>Car plat number</b></label>
                    <input type="text" name='carID' placeholder="Car plat number" value={carID} onChange={(e)=>setCarID(e.target.value)} required></input>
                    <label htmlFor="phone"><b>Phone</b></label>
                    <PhoneInput className="phoneInput" international placeholder="Enter phone number" value={phone} onChange={setPhone} isValidPhoneNumber required/>
                    {errorTrigger == "phoneError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>}
                    <button className="signupButton" type="submit" form="signupForm">Signup</button>
                </form>
            )}
            {phase==1 && (
                <>
                <p className="lineWithText"><span>Or</span></p>
                {/* <div id="signupGoogleButton"></div>
                {errorTrigger == "googleEmailError"?<p style={{color:'red', fontSize:'1rem'}}>{errorMessage}</p>:<></>} */}
                <center>Already have an account? <Link className="loginLink" to="/login">Login</Link></center>
                </>
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
            )
        }
        </div>
    );
};
export default SignupBox;
