package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.TopDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DriverDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DriverDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TopDriver> getTopDrivers() {
        String sql = "SELECT r.driver_id, d.driver_username AS driver_name, COUNT(*) AS reservation_count "
                + "FROM Reservation r "
                + "JOIN Driver d ON r.driver_id = d.id "
                + "GROUP BY r.driver_id "
                + "ORDER BY reservation_count DESC "
                + "LIMIT 10";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TopDriver driver = new TopDriver();
            driver.setDriverId(rs.getLong("driver_id"));
            driver.setDriverName(rs.getString("driver_name"));
            driver.setReservationCount(rs.getInt("reservation_count"));
            return driver;
        });

    }

}
