package com.example.Gopark.Services;

import com.example.Gopark.Classes.NotificationMessage;
import com.example.Gopark.Classes.ParkingSpot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final JdbcTemplate jdbcTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(JdbcTemplate jdbcTemplate, SimpMessagingTemplate messagingTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.messagingTemplate = messagingTemplate;
    }


    public void sendMessageToDriver(Long driverId, NotificationMessage message)
    {
            String sql = "INSERT INTO driver_notification (driver_id, content, time) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, driverId, message.getContent(), message.getTime());
           String topic = "/topic/driver/" + driverId;
           this.messagingTemplate.convertAndSend(topic,message);
    }
    public void sendMessageToManager(Long managerId, NotificationMessage message)
    {
        String sql = "INSERT INTO manager_notification (manager_id, content, time) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, managerId, message.getContent(), message.getTime());
        String topic = "/topic/manager/" + managerId;
        this.messagingTemplate.convertAndSend(topic,message);
    }

    public List<NotificationMessage> getAllDriverNotifications(Long driverId)
    {
        String sql="Select * FROM driver_notification WHERE driver_id=?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            NotificationMessage message = new NotificationMessage();
            message.setContent(rs.getString("content"));
            message.setTime(rs.getTime("time"));
            return message;
        }, driverId);
    }


}
