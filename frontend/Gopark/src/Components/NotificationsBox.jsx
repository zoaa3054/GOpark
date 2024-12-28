import { useEffect, useState } from "react";
import '../style.css';
import Notification from "./Notification";
import { toast } from "react-toastify";
import Modal from 'react-modal';

if (typeof global === "undefined") {
    window.global = window;
}


const NotificationsBox = ({ userId, showNotificationsBox, setShowNotificationsBox }) =>{
    const [notifications, setNotifications] = useState([{content: "lskjfd", time: "5"}]);
    useEffect(()=>{
        getNotifications();
    }, [userId]);

    const handleNotification = (notification) => {
         setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    };
    const notifiyNewNotification = (message)=>{
        toast.success(message);
    }

    const getNotifications = async()=>{
        await fetch(`http://localhost:8081/driver/notification/${userId}`)
        .then(response=>response.status==200||response.status==201?(()=>{return response.json();})():(()=>{throw Error("Error fetching notifications")})())
        .then(notificationsData=>{
            setNotifications(notificationsData);
            console.log(notificationsData);
        })
        .catch(e=>console.error(e));
    }
    return(
        <>
            {/* <Notification handleNotification={handleNotification} driverID={userId}/> */}
            <Modal
                isOpen={showNotificationsBox}
                onRequestClose={()=>setShowNotificationsBox(false)}
            >
                <button className="backButton" onClick={()=>setShowNotificationsBox(false)}>X</button>
                <center><h1>Notifications</h1></center>
                <div className="notificationsBox" >
                    {notifications.map((notification, i)=>(
                        <div className="notificationCard" key={i}>
                            <big>{notification.content}</big>
                            <small>{notification.time}</small>
                        </div>
                    ))}
                </div>
            </Modal>
            
        </>
    );
}

export default NotificationsBox;