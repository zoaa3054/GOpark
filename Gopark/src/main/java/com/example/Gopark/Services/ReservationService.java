package com.example.Gopark.Services;

import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.DAOS.ReservationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
