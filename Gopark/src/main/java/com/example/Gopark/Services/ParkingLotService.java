package com.example.Gopark.Services;

import com.example.Gopark.Classes.ParkingLot;
import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.DAOS.ParkingLotDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingLotService {

    @Autowired
    ParkingLotDAO parkingLotDAO;
    public List<ParkingSpot> getLotByID(int id) {

       return parkingLotDAO.getSpotsInLot(id);
    }

    public List<ParkingLot> getAllParkingLots()
    {
       return parkingLotDAO.getLots();
    }

    public List<ParkingLot> deleteParkingLot(int id){
        return parkingLotDAO.deleteLot(id);
    }

    public  List<ParkingLot> addParkingLot(ParkingLot parkingLot, int numberOfRequlerSpots, int numberOfDisapledSpots, int numberOfEVChargingSpots, String managerEmail, String managerPassword){
        return parkingLotDAO.addParkingLot(parkingLot, numberOfRequlerSpots, numberOfDisapledSpots, numberOfEVChargingSpots, managerEmail, managerPassword);
    }

}
