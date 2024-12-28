package com.example.Gopark.Controllers;


import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.Services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @GetMapping("/getCost")
    public float getCost(@RequestHeader("startTime")String startTimeString, @RequestHeader("endTime")String endTimeString, @RequestHeader("lotId")Long lotId){
        // Parse the string headers into Timestamps
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime startDateTime = LocalDateTime.parse(startTimeString, formatter);
        LocalDateTime endDateTime = LocalDateTime.parse(endTimeString, formatter);
        Timestamp startTime = Timestamp.valueOf(startDateTime);
        Timestamp endTime = Timestamp.valueOf(endDateTime);
        return reservationService.getCost(startTime, endTime, lotId);
    }
}
