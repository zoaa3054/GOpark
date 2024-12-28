import { useEffect, useState } from "react";
import '../style.css';
import Notification from "./Notification";
import { toast } from "react-toastify";


if (typeof global === "undefined") {
    window.global = window;
}


const NotificationsBox = ({ userId, showNotificationsBox }) =>{
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
        })
        .catch(e=>console.error(e));
    }
    return(
        <div className="notificationsBox" style={{transform: `${showNotificationsBox?"translate(0%, 0%)":"translate(0%, 0%)"}`}}>
            {/* <Notification handleNotification={handleNotification} driverID={userId}/> */}
            {notifications.map((notification, i)=>(
                <div className="notificationCard" key={i}>
                    <big>{notification.content}</big>
                    <small>{notification.time}</small>
                </div>
            ))}
        </div>
    );
}

export default NotificationsBox;