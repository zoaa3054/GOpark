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
}
