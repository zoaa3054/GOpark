package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class ParkingSpot {
    private int parkingLotId;
    private int number;
    private String type;
    private String RealTimeState;  //Occupied , Available , //reserved
}
