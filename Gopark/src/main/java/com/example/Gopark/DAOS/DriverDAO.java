package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.TopDriver;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.ParkingLot;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DriverDAO {

    private final JdbcTemplate jdbcTemplate;


    public DriverDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TopDriver> getTopDrivers() {
        String sql="SELECT r.driver_id, d.driver_username AS driver_name, COUNT(*) AS reservation_count "
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

    public Driver insertDriver(Driver driver) throws RuntimeException{
        String sql = "INSERT INTO DRIVER (driver_username, password, email, phone, car_plate) " +
                "VALUES (?, ?, ?, ?, ?)";
        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    driver.getDriverUserName(),
                    driver.getPassword(),
                    driver.getEmailAddress(),
                    driver.getPhoneNumber(),
                    driver.getCarPlateNumber());

            if (rowsAffected > 0) {
                return login(driver.getEmailAddress(), driver.getPassword());
            } else {
                throw new RuntimeException("Failed to insert driver: No rows affected");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to insert driver: " + e.getMessage(), e);
        }
    }

    public Driver login(String emailAddress, String password) {
        String sql = "SELECT * FROM DRIVER WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{emailAddress, password}, (rs, rowNum) -> {
                Driver driver = new Driver();
                driver.setId(rs.getLong("id"));
                driver.setDriverUserName(rs.getString("driver_username"));
                driver.setPassword(rs.getString("password"));
                driver.setEmailAddress(rs.getString("email"));
                driver.setPhoneNumber(rs.getString("phone"));
                driver.setCarPlateNumber(rs.getString("car_plate"));
                return driver;
            });
        } catch (Exception e) {
            throw new RuntimeException("Login failed: Invalid username or password", e);
        }
    }

}
