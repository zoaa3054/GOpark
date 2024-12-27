package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.ParkingLot;

import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Services.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @GetMapping("/getLot/{id}")
    public List<ParkingSpot> getLotByID(@PathVariable int id)
    {
         return parkingLotService.getLotByID(id);
    }

    @GetMapping("/getLots")
    public List<ParkingLot> getLotsByLocation()
    {
        return parkingLotService.getAllParkingLots();
    }

}
