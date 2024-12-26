package com.example.Gopark.Services;

import com.example.Gopark.Classes.ManagerReportData;
import com.example.Gopark.Classes.TopDriver;
import com.example.Gopark.Classes.TopParkingLot;
import com.example.Gopark.Classes.Violation;
import com.example.Gopark.DAOS.DriverDAO;
import com.example.Gopark.DAOS.ParkingLotDAO;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportingService {

    private final ParkingLotDAO parkingLotDAO;
    private final DriverDAO driverDAO;

    @Autowired
    public ReportingService(ParkingLotDAO parkingLotDAO, DriverDAO driverDAO) {
        this.parkingLotDAO = parkingLotDAO;
        this.driverDAO = driverDAO;
    }


    public void getManagerReports(Long managerId) {
        String path = "C:\\Users\\20100\\JaspersoftWorkspace\\MyReports\\managerReport.jrxml";
        List<ManagerReportData> occupancyRates = parkingLotDAO.getOccupancyRateByManagerID(managerId);
        List<Violation> violations = parkingLotDAO.getViolationsByManagerID(managerId);

        Double totalRevenue = occupancyRates.stream()
                .mapToDouble(ManagerReportData::getRevenue)
                .sum();

        // Create data sources
        JRBeanCollectionDataSource occupancyRatesDataSource = new JRBeanCollectionDataSource(occupancyRates);
        JRBeanCollectionDataSource violationsDataSource = new JRBeanCollectionDataSource(violations);

        // Parameters for Jasper
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("totalRevenue", totalRevenue);
        parameters.put("occupancyRatesDataSource", occupancyRatesDataSource);
        parameters.put("violationsDataSource", violationsDataSource);

        // Compile and generate the report
        try {
            JasperReport jasperReport = JasperCompileManager.compileReport(path);
            // Use violationsDataSource instead of JREmptyDataSource
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, violationsDataSource);

            // Export the report (PDF example)
            JasperExportManager.exportReportToPdfFile(jasperPrint, "ManagerReport.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getAdminReport()
    {
        String path = "C:\\Users\\20100\\JaspersoftWorkspace\\MyReports\\AdminReport.jrxml";

        // Get the data for the top 10 drivers
        List<TopDriver> topDrivers = driverDAO.getTopDrivers();

        // Get the data for the top parking lots
        List<TopParkingLot> topParkingLots = parkingLotDAO.getTopParkingLots();

        // Create data sources
        JRBeanCollectionDataSource driversDataSource = new JRBeanCollectionDataSource(topDrivers);
        JRBeanCollectionDataSource lotsDataSource = new JRBeanCollectionDataSource(topParkingLots);

        // Parameters for the report
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("driversDataSource", driversDataSource);
        parameters.put("lotsDataSource", lotsDataSource);

        // Compile and generate the report
        try {
            JasperReport jasperReport = JasperCompileManager.compileReport(path);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

            // Export the report (PDF example)
            JasperExportManager.exportReportToPdfFile(jasperPrint, "AdminReport.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
