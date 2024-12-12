import LoginBox from "../Components/LoginBox"
import "../style.css"
import googleLogo from '../assets/logo.png'

import { Link } from 'react-router-dom';

const WelcomePage = () =>{

    return(
        <div className="welcomePage">
            <div className="container">
                <center><h1>Welcome</h1></center>
                <center><img src={googleLogo} alt="" className="logoImage"/></center>
                <div className="buttons">
                    <Link className="signupButton" to="/system/admin/login">Login as SystemAdmin</Link>
                    <Link className="signupButton" to="/signup">Signup</Link>
                    <Link className="signupButton" to="/park/admin/login">Login as ParkAdmin</Link>
                </div>
            </div>
            <LoginBox/>
        </div>
    );
};
export default WelcomePage;