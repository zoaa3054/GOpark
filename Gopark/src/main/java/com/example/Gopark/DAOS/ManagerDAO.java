package com.example.Gopark.DAOS;


import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.Manager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ManagerDAO {

    private final JdbcTemplate jdbcTemplate;
    
    public ManagerDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Manager insertManager(Manager manager) {
        String sql = "INSERT INTO MANAGER (username, password, phone, email) " +
                "VALUES (?, ?, ?, ?)";
        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    manager.getUserName(),
                    manager.getPassword(),
                    manager.getPhoneNumber(),
                    manager.getEmailAddress());

            if (rowsAffected > 0) {
                return manager;
            } else {
                throw new RuntimeException("Failed to insert manager: No rows affected");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to insert manager: " + e.getMessage(), e);
        }
    }

    public Manager login(String emailAddress, String password) {
        String sql = "SELECT * FROM MANAGER WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{emailAddress, password}, (rs, rowNum) -> {
                Manager manager = new Manager();
                manager.setId(rs.getLong("id"));
                manager.setUserName(rs.getString("username"));
                manager.setPassword(rs.getString("password"));
                manager.setEmailAddress(rs.getString("email"));
                manager.setPhoneNumber(rs.getString("phone"));
                return manager;
            });
        } catch (Exception e) {
            throw new RuntimeException("Login failed: Invalid username or password", e);
        }
    }
}
