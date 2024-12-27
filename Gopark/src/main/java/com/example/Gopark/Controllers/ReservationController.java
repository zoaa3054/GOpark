package com.example.Gopark.Controllers;


import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.Services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/users")
public class ReservationController {
    @Autowired
    ReservationService reservationService;
    @PostMapping("/reserveSpot")
    public void reserveSpot(@RequestBody Reservation reservation) {
        reservationService.addNewReservation(reservation);
    }

    @GetMapping("/getActiveReservation")
    public List<Reservation> getActiveReservationsBySpot(@RequestParam int parkID, @RequestParam int spotNumber) {
        return reservationService.getReservationsBySpot(parkID, spotNumber);
    }

    @GetMapping("/getActiveReservationByLot")
    public List<Reservation> getActiveReservationByLot(@RequestParam int parkID) {

        return reservationService.getReservationsByLot(parkID);
    }
}
