package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.ParkingLot;

import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Services.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/api/v1/users/deleteLot/{id}")
    public List<ParkingLot> deleteLot(@PathVariable int id)
    {
        return parkingLotService.deleteParkingLot(id);
    }

    @PostMapping("/api/v1/system/admin/addLot")
    public List<ParkingLot> addLot(@RequestBody ParkingLot parkingLot, @RequestHeader("numberOfRequlerSpots") int numberOfRequlerSpots, @RequestHeader("numberOfDisapledSpots") int numberOfDisapledSpots, @RequestHeader("numberOfEVChargingSpots") int numberOfEVChargingSpots, @RequestHeader("ManagerEmail") String managerEmail, @RequestHeader("ManagerPassword") String managerPassword)
    {
        return parkingLotService.addParkingLot(parkingLot, numberOfRequlerSpots, numberOfDisapledSpots, numberOfEVChargingSpots, managerEmail, managerPassword);
    }

}
