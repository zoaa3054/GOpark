import { useEffect, useState } from "react";
import '../style.css';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";


if (typeof global === "undefined") {
    window.global = window;
}


const NotificationsBox = ({ userId, showNotificationsBox }) =>{
    const [notifications, setNotifications] = useState([{}]);
    const [currentNotification, setCurrentNotification] = useState({});
    useEffect(()=>{
        getNotifications();
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe(`/topic/${driverId}`, (message) => {
                    const notification = JSON.parse(message.body);
                    console.log("Notification received:", notification);
                    setCurrentNotification(notification);
                    notifiyNewNotification(`\nBody: ${notification.content}\nTimestamp: ${notification.time}`);
                });
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };

    }, [currentNotification, userId]);

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