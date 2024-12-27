import React, { useState, useEffect } from 'react';
import createSocket from './Socket.js';

function Notification({ handleNotification, driverID }) {

    useEffect(() => {
        console.log("driverId: ", driverID);
        const deactivateSocket = createSocket(`/topic/driver/${driverID}`, handleNotification);
        return () => {
            deactivateSocket(); 
        };
    }, []);

    return (
        <></>
    );
}

export default Notification;