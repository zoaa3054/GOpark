package com.example.Gopark.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import com.example.Gopark.db.Database;

import java.sql.SQLException;

import javax.sql.DataSource;

@Configuration
public class AppConfig {
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        try {
            Database.getDb(jdbcTemplate);
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return jdbcTemplate;
    }
}
