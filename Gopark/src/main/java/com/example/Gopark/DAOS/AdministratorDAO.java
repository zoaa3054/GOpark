package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.Administrator;
import com.example.Gopark.Classes.Driver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdministratorDAO {
    private final JdbcTemplate jdbcTemplate;

    public AdministratorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Administrator login(String emailAddress, String password) {
        String sql = "SELECT * FROM ADMINISTRATOR WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{emailAddress, password}, (rs, rowNum) -> {
                Administrator administrator = new Administrator();
                administrator.setId(rs.getInt("id"));
                administrator.setUserName(rs.getString("username"));
                administrator.setPassword(rs.getString("password"));
                administrator.setEmailAddress(rs.getString("email"));
                return administrator;
            });
        } catch (Exception e) {
            throw new RuntimeException("Login failed: Invalid username or password", e);
        }
    }
}
