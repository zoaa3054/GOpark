package com.example.Gopark.Classes;

import lombok.Data;
import org.springframework.data.geo.Point;

@Data
public class ParkingLot {
    private Long id;
    private Point location; // Use a suitable type for spatial data (e.g., org.locationtech.jts.geom.Point if using JTS library)
    private Float basePrice;
    private String name;
    private Long managerId;
    private Integer totalSpots;
    private Integer occupiedSpots;
    private Float currentPrice;
}