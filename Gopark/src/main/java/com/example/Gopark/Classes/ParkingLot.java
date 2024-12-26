package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class ParkingLot {

    private int id;
    private String location;
    private double basePrice;
    private String name;
    private int managerId;
    private int occupiedSpots;
    private int totalSpots;
    private double currentPrice;

}
