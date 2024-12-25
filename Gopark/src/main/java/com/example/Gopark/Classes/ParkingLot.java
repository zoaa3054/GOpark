package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class ParkingLot {

    private int id;
    private String location;
    private float basePrice;
    private String name;
    private int managerId;

}
