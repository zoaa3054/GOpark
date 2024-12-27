package com.example.Gopark.Simulation;

import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.Classes.ParkingSpot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Component
public class ParkingSimulator {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Scheduled(fixedRate = 60000) // Executes every minute
    public void updateReservationsAndParkingSpots() {
        try {
            // Query to retrieve active reservations with null arrival
            String reservationQuery = "SELECT * FROM reservation WHERE end_time > ? AND arrival IS NULL AND start_time < ?";
            List<Reservation> activeReservations = jdbcTemplate.query(reservationQuery, new Object[]{Timestamp.from(Instant.now()), Timestamp.from(Instant.now())}, (rs, rowNum) -> {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getInt("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setArrival(rs.getTimestamp("arrival"));
                reservation.setDeparture(rs.getTimestamp("deprature"));
                reservation.setCost(rs.getDouble("cost"));
                return reservation;
            });
//            System.out.println(activeReservations.size());
            for (Reservation reservation : activeReservations) {
                boolean updateOrNot = (Math.random() > 0.5);
                if(updateOrNot) {
                    System.out.println("updating ...");
                    // Update the arrival time to the current timestamp
                    Timestamp currentTimestamp = Timestamp.from(Instant.now());
                    long differenceInMillis = currentTimestamp.getTime() - reservation.getStartTime().getTime();
                    String updateReservationQuery = "UPDATE reservation SET arrival = ? WHERE id = ?";
                    jdbcTemplate.update(updateReservationQuery, currentTimestamp, reservation.getId());

                    // Update the parking spot state to 'Occupied'
                    String updateParkingSpotQuery = "UPDATE parking_spot SET state = 'Occupied' WHERE parking_lot_id = ? AND number = ?";
                    jdbcTemplate.update(updateParkingSpotQuery, reservation.getLotId(), reservation.getSpotNumber());

                    long minutes = differenceInMillis / (1000 * 60);
                    System.out.println(differenceInMillis + " " + minutes);
                    if(minutes >= 1) {
                        String insertQuery = "INSERT INTO violation (type, penalty, paid, reservation_id) VALUES (?, ?, ?, ?)";
                        // Execute the insert
                        jdbcTemplate.update(insertQuery,
                                "non-use",
                                (double) (minutes * 0.2),
                                false,
                                reservation.getId()
                        );
                    }
                }
            }


            // Query to retrieve reservations where arrival is not null, departure is null, and end_time has passed
            String departedReservationQuery = "SELECT * FROM reservation WHERE arrival IS NOT NULL AND deprature IS NULL AND end_time <= ?";
            List<Reservation> departedReservations = jdbcTemplate.query(departedReservationQuery, new Object[]{Timestamp.from(Instant.now())}, (rs, rowNum) -> {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getInt("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setArrival(rs.getTimestamp("arrival"));
                reservation.setDeparture(rs.getTimestamp("deprature"));
                reservation.setCost(rs.getDouble("cost"));
                return reservation;
            });

            for (Reservation reservation : departedReservations) {
                boolean updateOrNot = (Math.random() > 0.2);
                if(updateOrNot) {
                    // Update the departure time to the current timestamp
                    Timestamp currentTimestamp = Timestamp.from(Instant.now());
                    long differenceInMillis = currentTimestamp.getTime() - reservation.getEndTime().getTime();
                    String updateDepartureQuery = "UPDATE reservation SET deprature = ? WHERE id = ?";
                    jdbcTemplate.update(updateDepartureQuery, currentTimestamp, reservation.getId());

                    // Update the parking spot state to 'Available'
                    String updateParkingSpotQuery = "UPDATE parking_spot SET state = 'Available' WHERE parking_lot_id = ? AND number = ?";
                    jdbcTemplate.update(updateParkingSpotQuery, reservation.getLotId(), reservation.getSpotNumber());

                    long minutes = differenceInMillis / (1000 * 60);
                    System.out.println(differenceInMillis + " " + minutes);
                    if(minutes >= 0) {
                        String insertQuery = "INSERT INTO violation (type, penalty, paid, reservation_id) VALUES (?, ?, ?, ?)";
                        // Execute the insert
                        jdbcTemplate.update(insertQuery,
                                "overuse",
                                (double) (minutes * 0.2),
                                false,
                                reservation.getId()
                        );
                    }
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to update reservations and parking spots: " + e.getMessage(), e);
        }
    }
}

