package com.example.Gopark.DAOS;

import com.example.Gopark.Classes.*;
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
            parkingLot.setId((rs.getLong("id")));
            parkingLot.setLongitude((rs.getFloat("longitude")));
            parkingLot.setLatitude(((rs.getFloat("latitude"))));
            parkingLot.setBasePrice(rs.getFloat("base_Price"));
            parkingLot.setName(rs.getString("name"));
            parkingLot.setManagerId(rs.getLong("manager_Id"));
            parkingLot.setOccupiedSpots(rs.getInt("occupied_Spots"));
            parkingLot.setTotalSpots(rs.getInt("total_Spots"));
            parkingLot.setCurrentPrice(rs.getFloat("current_Price"));
            return parkingLot;
        });
    }

    public List<ParkingLot> deleteLot(int id){
        String sqlForLotViolationDeletion = "DELETE FROM Violation WHERE reservation_id in (SELECT id FROM reservation WHERE reservation.lot_id = ?)";
        jdbcTemplate.update(sqlForLotViolationDeletion, id);
        String sqlForLotReservationsDeletion = "DELETE FROM Reservation WHERE lot_id = ?";
        jdbcTemplate.update(sqlForLotReservationsDeletion, id);
        String sqlForLotSpotsDeletion = "DELETE FROM Parking_Spot WHERE parking_lot_id = ?";
        jdbcTemplate.update(sqlForLotSpotsDeletion, id);
        String sqlForLotDeletion = "DELETE FROM Parking_Lot WHERE id = ?";
        jdbcTemplate.update(sqlForLotDeletion, id);
        return getLots();
    }

    public List<ParkingLot> addParkingLot(ParkingLot parkingLot, int numberOfRequlerSpots, int numberOfDisapledSpots, int numberOfEVChargingSpots, String managerEmail, String managerPassword){
        List<ParkingLot> resultLots = null;
        ManagerDAO managerDAO = new ManagerDAO(jdbcTemplate);
        Manager manager = null;
        try {
            manager = managerDAO.login(managerEmail, managerPassword);
        }catch (Exception e){
            throw e;
        }

        String sqlForLot = "INSERT INTO parking_lot (longitude, latitude, base_Price, name, manager_Id, total_Spots, occupied_Spots, current_Price) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            int rowsAffectedByLotInsertion = jdbcTemplate.update(sqlForLot,
                    parkingLot.getLongitude(),
                    parkingLot.getLatitude(),
                    parkingLot.getBasePrice(),
                    parkingLot.getName(),
                    manager.getId(),
                    parkingLot.getTotalSpots(),
                    0,
                    parkingLot.getBasePrice()
                    );

            if (rowsAffectedByLotInsertion > 0) {
                resultLots = getLots();
                long currentLotId = resultLots.get(resultLots.size()-1).getId();
                String sqlForSpots = "INSERT INTO parking_spot (parking_lot_id, number, type, state) " +
                        "VALUES (?, ?, ?, ?)";
                for (int i=1; i<=parkingLot.getTotalSpots(); i++) {
                    String type = null;
                    if (numberOfRequlerSpots > 0){
                        type = "regular";
                        --numberOfRequlerSpots;
                    }
                    else if (numberOfDisapledSpots > 0){
                        type = "disapled";
                        --numberOfDisapledSpots;
                    }
                    else {
                        type = "EV charging";
                        --numberOfEVChargingSpots;
                    }
                    try {
                        int rowsAffectedBySpotsInsection = jdbcTemplate.update(sqlForSpots,
                                currentLotId,
                                i,
                                type,
                                "available"
                        );
                        if (rowsAffectedBySpotsInsection == 0) {
                            throw new RuntimeException("Failed to insert lot: No rows affected");
                        }
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to insert spot: " + e.getMessage(), e);
                    }
                }
                return resultLots;
            } else {
                throw new RuntimeException("Failed to insert lot: No rows affected");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to insert lot: " + e.getMessage(), e);
        }
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
        }, id);
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
                        p.id, p.occupied_spots, p.total_spots
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

    public List<TopParkingLot> getTopParkingLots() {
        String sql = "SELECT r.lot_id, l.name AS lot_name, SUM(r.cost) AS total_revenue "
                + "FROM Reservation r "
                + "JOIN Parking_Lot l ON r.lot_id = l.id "
                + "GROUP BY r.lot_id "
                + "ORDER BY total_revenue DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TopParkingLot lot = new TopParkingLot();
            lot.setLotId(rs.getLong("lot_id"));
            lot.setLotName(rs.getString("lot_name"));
            lot.setTotalRevenue(rs.getDouble("total_revenue"));
            return lot;
        });
    }
}
