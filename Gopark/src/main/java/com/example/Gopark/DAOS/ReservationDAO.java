package com.example.Gopark.DAOS;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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

}
