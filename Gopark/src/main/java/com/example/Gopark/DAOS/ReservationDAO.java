package com.example.Gopark.DAOS;


import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import com.example.Gopark.Classes.Reservation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ReservationDAO {

    private final JdbcTemplate jdbcTemplate;

    public ReservationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;

    }
    public long getManagerRevenues(long lotId) {
        String sql = "SELECT SUM(cost) AS total_revenue FROM Reservation WHERE lot_id = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, lotId);
    }


    public void insertReservation(Reservation reservation) {
//        String sql = "INSERT INTO reservation (driver_id, lot_id, spot_number, start_time, end_time, cost) " +
//                "VALUES (?, ?, ?, ?, ?, ?)";
//        System.out.println(reservation.getDriverId());
//        int rowsInserted = jdbcTemplate.update(sql,
//                reservation.getDriverId(),
//                reservation.getLotId(),
//                reservation.getSpotNumber(),
//                reservation.getStartTime(),
//                reservation.getEndTime(),
//                reservation.getCost());
//
//        if (rowsInserted == 0) {
//            throw new RuntimeException("Failed to insert reservation.");
//        }
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("create_reservation_future");
        String sql = "CALL create_reservation_future(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, reservation.getStartTime(),
        reservation.getEndTime(),
        reservation.getLotId(),
        reservation.getSpotNumber(),
        reservation.getDriverId(),
        reservation.getCost());
    }

    public List<Reservation> getActiveReservationsForSpot(int parkingLotId, int spotNumber) {
        String sql = "SELECT * FROM reservation " +
                "WHERE lot_id = ? AND spot_number = ? AND end_time > NOW()";

        return jdbcTemplate.query(sql, new Object[]{parkingLotId, spotNumber}, new RowMapper<Reservation>() {
            @Override
            public Reservation mapRow(ResultSet rs, int rowNum) throws SQLException {
                Reservation reservation = new Reservation();
                reservation.setId(rs.getInt("id"));
                reservation.setDriverId(rs.getInt("driver_id"));
                reservation.setLotId(rs.getInt("lot_id"));
                reservation.setSpotNumber(rs.getInt("spot_number"));
                reservation.setStartTime(rs.getTimestamp("start_time"));
                reservation.setEndTime(rs.getTimestamp("end_time"));
                reservation.setCost(rs.getDouble("cost"));
                return reservation;
            }
        });
    }
}
