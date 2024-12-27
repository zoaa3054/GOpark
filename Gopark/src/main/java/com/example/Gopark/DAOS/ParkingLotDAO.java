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
        String sql = "SELECT * FROM Parking_Lot";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingLot parkingLot = new ParkingLot();
            parkingLot.setId(rs.getInt("id"));
            parkingLot.setLocation(rs.getString("location"));
            parkingLot.setBasePrice(rs.getDouble("base_Price"));
            parkingLot.setName(rs.getString("name"));
            parkingLot.setManagerId(rs.getInt("manager_Id"));
            parkingLot.setOccupiedSpots(rs.getInt("occupied_Spots"));
            parkingLot.setTotalSpots(rs.getInt("total_Spots"));
            parkingLot.setCurrentPrice(rs.getDouble("currend_Price"));
            return parkingLot;
        });
    }

    public List<ParkingSpot> getSpotsInLot(int id) {
        String sql = "SELECT * FROM parking_spot WHERE parking_Lot_Id = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingSpot spot = new ParkingSpot();
            spot.setParkingLotId(rs.getInt("parking_lot_id"));
            spot.setNumber(rs.getInt("number"));
            spot.setType(rs.getString("type"));
            spot.setRealTimeState(rs.getString("state"));
            return spot;
        }, id); // `id` is passed as the parameter to the query
    }

}
