package com.example.Gopark.Classes;

import lombok.Data;

<<<<<<< HEAD
import java.sql.Timestamp;
import java.util.Date;

@Data
public class Reservation {
    int id;
    int driverId;
    int lotId;
    int spotNumber;
    Timestamp startTime;
    Timestamp endTime;
    Timestamp arrival;
    Timestamp departure;
    double cost;
}
=======
import java.time.LocalDateTime;

@Data
public class Reservation {
    private Long id;
    private Long driverId;
    private Long lotId;
    private Integer spotNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime arrival;
    private LocalDateTime departure;
    private Float cost;
}
>>>>>>> origin/notifications
