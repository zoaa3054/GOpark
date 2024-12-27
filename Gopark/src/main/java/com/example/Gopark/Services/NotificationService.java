package com.example.Gopark.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessageToDriver(Long driverId,String message)
    {

    }
}
