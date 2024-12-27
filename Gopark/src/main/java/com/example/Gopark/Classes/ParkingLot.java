package com.example.Gopark.Classes;

import lombok.Data;
import org.springframework.data.geo.Point;

@Data
public class ParkingLot {
    private Long id;
    private Float longitude;
    private Float latitude;
    private Float basePrice;
    private String name;
    private Long managerId;
    private Integer totalSpots;
    private Integer occupiedSpots;
    private Float currentPrice;
}