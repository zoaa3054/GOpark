package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.ParkingLot;

import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Services.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin("http://localhost:8080")

@RestController
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @GetMapping("/api/v1/getSpots/{id}")
    public List<ParkingSpot> getLotByID(@PathVariable int id)
    {
         return parkingLotService.getLotByID(id);
    }

    @GetMapping("/api/v1/users/getLots")
    public List<ParkingLot> getLotsByLocation()
    {
        return parkingLotService.getAllParkingLots();
    }

}
