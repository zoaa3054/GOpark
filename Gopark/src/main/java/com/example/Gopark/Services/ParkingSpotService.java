package com.example.Gopark.Services;


import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.DAOS.ParkingSpotDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingSpotService {

    @Autowired
    ParkingSpotDAO parkingSpotDAO;

    public List<ParkingSpot> getSpotsByLot(int lotId) {
        return parkingSpotDAO.getSpotsByLot(lotId);
    }
}
