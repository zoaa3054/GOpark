package com.example.Gopark.Simulation;

import com.example.Gopark.Classes.NotificationMessage;
import com.example.Gopark.Classes.Reservation;
import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Component
public class ParkingSimulator {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Scheduled(fixedRate = 5 * 60000) // Executes every minute
    public void updateReservationsAndParkingSpots() {
        try {
            // Query to retrieve active reservations with null arrival
            String reservationQuery = "SELECT * FROM reservation WHERE end_time > ? AND arrival IS NULL AND start_time < ?";
            List<Reservation> activeReservations = jdbcTemplate.query(reservationQuery, new Object[]{Timestamp.from(Instant.now()), Timestamp.from(Instant.now())}, (rs, rowNum) -> {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getLong("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setArrival(rs.getTimestamp("arrival"));
                reservation.setDeparture(rs.getTimestamp("departure"));
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
                        NotificationMessage message = new NotificationMessage(
                                "Your are late and got fined with " + (minutes * 0.2) + "$",
                                Timestamp.from(Instant.now())
                        );
                        notificationService.sendMessageToDriver(reservation.getDriverId(), message);
                    }
                }
            }


            // Query to retrieve reservations where arrival is not null, departure is null, and end_time has passed
            String departedReservationQuery = "SELECT * FROM reservation WHERE departure IS NULL AND end_time <= ?";
            List<Reservation> departedReservations = jdbcTemplate.query(departedReservationQuery, new Object[]{Timestamp.from(Instant.now())}, (rs, rowNum) -> {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getLong("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setArrival(rs.getTimestamp("arrival"));
                reservation.setDeparture(rs.getTimestamp("departure"));
                reservation.setCost(rs.getDouble("cost"));
                return reservation;
            });

            for (Reservation reservation : departedReservations) {
                if(reservation.getArrival() == null) {
                    Timestamp currentTimestamp = Timestamp.from(Instant.now());
                    String updateDepartureQuery = "UPDATE reservation SET departure = ? WHERE id = ?";
                    jdbcTemplate.update(updateDepartureQuery, currentTimestamp, reservation.getId());
                    String insertQuery = "INSERT INTO violation (type, penalty, paid, reservation_id) VALUES (?, ?, ?, ?)";
                    long minutes = (reservation.getEndTime().getTime() - reservation.getStartTime().getTime()) / (1000 * 60);
                    // Execute the insert
                    jdbcTemplate.update(insertQuery,
                            "non-use",
                            (double) (minutes * 0.2),
                            false,
                            reservation.getId()
                    );
                    NotificationMessage message = new NotificationMessage(
                            "Your didn't show up and got fined with " + (minutes * 0.2) + "$",
                            Timestamp.from(Instant.now())
                    );
                    notificationService.sendMessageToDriver(reservation.getDriverId(), message);
                }
                else {
                    boolean updateOrNot = (Math.random() > 0.2);
                    if(updateOrNot) {
                        // Update the departure time to the current timestamp
                        Timestamp currentTimestamp = Timestamp.from(Instant.now());
                        long differenceInMillis = currentTimestamp.getTime() - reservation.getEndTime().getTime();
                        String updateDepartureQuery = "UPDATE reservation SET departure = ? WHERE id = ?";
                        jdbcTemplate.update(updateDepartureQuery, currentTimestamp, reservation.getId());

                        // Update the parking spot state to 'Available'
                        String updateParkingSpotQuery = "UPDATE parking_spot SET state = 'Available' WHERE parking_lot_id = ? AND number = ?";
                        jdbcTemplate.update(updateParkingSpotQuery, reservation.getLotId(), reservation.getSpotNumber());

                        long minutes = differenceInMillis / (1000 * 60);
                        System.out.println(differenceInMillis + " " + minutes);
                        if(minutes >= 2) {
                            String insertQuery = "INSERT INTO violation (type, penalty, paid, reservation_id) VALUES (?, ?, ?, ?)";
                            // Execute the insert
                            jdbcTemplate.update(insertQuery,
                                    "overstay",
                                    (double) (minutes * 0.2),
                                    false,
                                    reservation.getId()
                            );

                            NotificationMessage message = new NotificationMessage(
                                    "You over stayed in the parking spot and got fined with " + (minutes * 0.2) + "$",
                                    Timestamp.from(Instant.now())
                            );
                            notificationService.sendMessageToDriver(reservation.getDriverId(), message);
                        }
                    }
                }
            }


            reservationQuery = "SELECT * FROM reservation WHERE end_time BETWEEN ? AND ?";
            List<Reservation> endingSoonReservations = jdbcTemplate.query(reservationQuery, new Object[]{
                    Timestamp.from(Instant.now()),
                    Timestamp.from(Instant.now().plus(Duration.ofMinutes(5)))
            }, (rs, rowNum) -> {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getLong("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setArrival(rs.getTimestamp("arrival"));
                reservation.setDeparture(rs.getTimestamp("departure"));
                reservation.setCost(rs.getDouble("cost"));
                return reservation;
            });

            for(Reservation reservation : endingSoonReservations) {
                NotificationMessage message = new NotificationMessage(
                        "Your reservation is about to expire!",
                        Timestamp.from(Instant.now())
                );
                notificationService.sendMessageToDriver(reservation.getDriverId(), message);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to update reservations and parking spots: " + e.getMessage(), e);
        }
    }
}

