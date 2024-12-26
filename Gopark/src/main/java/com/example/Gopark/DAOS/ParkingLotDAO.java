package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.ParkingLot;
import com.example.Gopark.Classes.ParkingSpot;
import com.example.Gopark.Classes.ManagerReportData;
import com.example.Gopark.Classes.Violation;
import org.springframework.data.geo.Point;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ParkingLotDAO {
    private final JdbcTemplate jdbcTemplate;
    private final ReservationDAO reservationDAO;

    public ParkingLotDAO(JdbcTemplate jdbcTemplate, ParkingSpotDAO parkingSpotDAO, ReservationDAO reservationDAO) {
        this.jdbcTemplate = jdbcTemplate;

        this.reservationDAO = reservationDAO;
    }

    public List<ParkingLot> getLots() {
        String sql = "SELECT * FROM Parking_Lot";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingLot parkingLot = new ParkingLot();
            parkingLot.setId(( rs.getLong("id")));
            //parkingLot.setLocation((Point) rs.getObject("location"));
            parkingLot.setBasePrice(rs.getFloat("base_Price"));
            parkingLot.setName(rs.getString("name"));
            parkingLot.setManagerId(rs.getLong("manager_Id"));
            parkingLot.setOccupiedSpots(rs.getInt("occupied_Spots"));
            parkingLot.setTotalSpots(rs.getInt("total_Spots"));
            parkingLot.setCurrentPrice(rs.getFloat("currend_Price"));
            return parkingLot;
        });
    }

    public List<ParkingSpot> getSpotsInLot(int id) {
        String sql = "SELECT * FROM Parking_Spot WHERE parking_Lot_Id = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ParkingSpot spot = new ParkingSpot();
            spot.setParkingLotId(rs.getInt("parking_Lot_Id"));
            spot.setNumber(rs.getInt("number"));
            spot.setType(rs.getString("type"));
            spot.setRealTimeState(rs.getString("State"));
            return spot;
        }, id); // `id` is passed as the parameter to the query
    }

    public List<ManagerReportData> getOccupancyRateByManagerID(Long managerId) {
        String sql = """
        SELECT 
            p.name AS placeName,
            (p.occupied_spots / p.total_spots) AS occupancyRate,
            COALESCE(SUM(r.cost), 0) AS revenue
        FROM 
            Parking_Lot p
        LEFT JOIN 
            Reservation r 
        ON 
            p.id = r.lot_id
        WHERE 
            p.manager_id = ?
        GROUP BY 
            p.id, p.location, p.occupied_spots, p.total_spots
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ManagerReportData data = new ManagerReportData();
            data.placeName = rs.getString("placeName");
            data.occupancyRate = rs.getDouble("occupancyRate");
            data.revenue = rs.getDouble("revenue");
            return data;
        }, managerId);
    }

    public List<Violation> getViolationsByManagerID(Long managerId) {
        String sql = """
    SELECT v.id, v.type, v.penalty, v.paid, v.reservation_id
    FROM Violation v
    INNER JOIN Reservation r ON v.reservation_id = r.id
    INNER JOIN Parking_Lot p ON r.lot_id = p.id
    WHERE p.manager_id = ?
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Violation violation = new Violation();
            violation.setId(rs.getLong("id"));
            violation.setType(rs.getString("type"));
            violation.setPenalty(rs.getFloat("penalty"));
            violation.setPaid(rs.getBoolean("paid"));
            violation.setReservationId(rs.getLong("reservation_id"));
            return violation;
        }, managerId);
    }


}
