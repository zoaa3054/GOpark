package com.example.Gopark.Classes;

import lombok.Data;

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