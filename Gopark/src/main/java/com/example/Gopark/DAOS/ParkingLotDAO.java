package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.ParkingLot;
import com.example.Gopark.Classes.ParkingSpot;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ParkingLotDAO {
    private final JdbcTemplate jdbcTemplate;

    public ParkingLotDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ParkingLot> getLots() {
        String sql = "SELECT * FROM ParkingLot";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingLot parkingLot = new ParkingLot();
            parkingLot.setId(rs.getInt("id"));
            parkingLot.setLocation(rs.getString("location"));
            parkingLot.setBasePrice(rs.getDouble("basePrice"));
            parkingLot.setName(rs.getString("name"));
            parkingLot.setManagerId(rs.getInt("managerId"));
            parkingLot.setOccupiedSpots(rs.getInt("occupiedSpots"));
            parkingLot.setTotalSpots(rs.getInt("totalSpots"));
            parkingLot.setCurrentPrice(rs.getDouble("currentPrice"));
            return parkingLot;
        });
    }

    public List<ParkingSpot> getSpotsInLot(int id) {
        String sql = "SELECT * FROM ParkingSpot WHERE parkingLotId = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingSpot spot = new ParkingSpot();
            spot.setParkingLotId(rs.getInt("parkingLotId"));
            spot.setNumber(rs.getInt("number"));
            spot.setType(rs.getString("type"));
            spot.setRealTimeState(rs.getString("RealTimeState"));
            return spot;
        }, id); // `id` is passed as the parameter to the query
    }

}
