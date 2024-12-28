package com.example.Gopark.Classes;

import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;

@Data
public class Reservation {
    int id;
    long driverId;
    int lotId;
    int spotNumber;
    Timestamp startTime;
    Timestamp endTime;
    Timestamp arrival;
    Timestamp departure;
    double cost;
}
