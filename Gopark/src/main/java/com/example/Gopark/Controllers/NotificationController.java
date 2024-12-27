package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.NotificationMessage;
import com.example.Gopark.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin("http://localhost:8080")

@RestController
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/driver/notification/{driverId}")
    public List<NotificationMessage> getNotificationsByDriverID(@PathVariable Long driverId)
    {
        return notificationService.getAllDriverNotifications(driverId);
    }


}
