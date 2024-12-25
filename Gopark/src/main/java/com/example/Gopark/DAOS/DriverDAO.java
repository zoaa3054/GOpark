package com.example.Gopark.DAOS;

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

    public Driver insertDriver(Driver driver) {
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
                return driver;
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
                driver.setId(rs.getInt("id"));
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
