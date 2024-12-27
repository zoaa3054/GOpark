package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Services.ParkingSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ParkingSpotController {

    @Autowired
    ParkingSpotService parkingSpotService;

    @GetMapping("/getSpots")
    public List<ParkingSpot> getSpotsByLot(@RequestParam int lotId) {
        return parkingSpotService.getSpotsByLot(lotId);
    }
}
