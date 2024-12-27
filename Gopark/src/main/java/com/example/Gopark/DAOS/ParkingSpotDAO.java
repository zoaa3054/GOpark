package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Classes.Reservation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ParkingSpotDAO {

    //TODO : add Trigger to change spot status and current price of the lot

    private final JdbcTemplate jdbcTemplate;

    public ParkingSpotDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ParkingSpot> getSpotsByLot(int lotId) {
        String sql = "SELECT * FROM PARKING_SPOT " +
                "WHERE parking_lot_id = ? ";

        return jdbcTemplate.query(sql, new Object[]{lotId}, new RowMapper<ParkingSpot>() {
            @Override
            public ParkingSpot mapRow(ResultSet rs, int rowNum) throws SQLException {
                ParkingSpot parkingSpot = new ParkingSpot();
                parkingSpot.setParkingLotId(rs.getInt("parking_lot_id"));
                parkingSpot.setNumber(rs.getInt("number"));
                parkingSpot.setType(rs.getString("type"));
                parkingSpot.setRealTimeState(rs.getString("spot_number"));
                return parkingSpot;
            }
        });
    }
}
