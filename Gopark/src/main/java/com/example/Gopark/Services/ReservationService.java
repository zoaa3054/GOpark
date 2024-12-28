package com.example.Gopark.Services;

import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.DAOS.ReservationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ReservationService {
    @Autowired
    ReservationDAO reservationDAO;

    public void addNewReservation(Reservation reservation) {
        reservationDAO.insertReservation(reservation);
    }

    public List<Reservation> getReservationsBySpot(int parkingLotId, int spotNumber) {
        return reservationDAO.getActiveReservationsForSpot(parkingLotId, spotNumber);
    }

    public List<Reservation> getReservationsByLot(int parkID) {
        return reservationDAO.getActiveReservationsForLot(parkID);
    }


    public float getCost(Timestamp startTime, Timestamp endTime, Long lotId){
        return reservationDAO.getCost(startTime, endTime, lotId);
    }
}
