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
        String path1 = "C:\\Users\\20100\\JaspersoftWorkspace\\MyReports\\managerOccupancyReport.jrxml";
        String path2="C:\\Users\\20100\\JaspersoftWorkspace\\MyReports\\managerViolationsReport.jrxml";
        List<ManagerReportData> occupancyRates = parkingLotDAO.getOccupancyRateByManagerID(managerId);
        List<Violation> violations = parkingLotDAO.getViolationsByManagerID(managerId);



        // Create data sources
        JRBeanCollectionDataSource occupancyRatesDataSource = new JRBeanCollectionDataSource(occupancyRates);
        JRBeanCollectionDataSource violationsDataSource = new JRBeanCollectionDataSource(violations);

        // Parameters for Jasper
        Map<String, Object> parameters1 = new HashMap<>();
        parameters1.put("revenueOccupancyDataSource", occupancyRatesDataSource);

        Map<String,Object>parameters2=new HashMap<>();
        parameters2.put("violationsDataSource", violationsDataSource);

        // Compile and generate the report
        try {
            JasperReport jasperReport1 = JasperCompileManager.compileReport(path1);
            JasperReport jasperReport2=JasperCompileManager.compileReport(path2);
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(jasperReport1, parameters1, new JREmptyDataSource());
            JasperPrint jasperPrint2=JasperFillManager.fillReport(jasperReport2,parameters2,new JREmptyDataSource());
            JasperExportManager.exportReportToPdfFile(jasperPrint1, "ManagerOccupancyReport.pdf");
            JasperExportManager.exportReportToPdfFile(jasperPrint2,"ManagerViolationsReport.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getAdminReport()
    {
        String path1 = "C:\\Users\\20100\\JaspersoftWorkspace\\MyReports2\\AdminTopDriversReport.jrxml";
        String path2= "C:\\Users\\20100\\JaspersoftWorkspace\\myReports2\\AdminTopLotsReport.jrxml";

        // Get the data for the top 10 drivers
        List<TopDriver> topDrivers = driverDAO.getTopDrivers();

        // Get the data for the top parking lots
        List<TopParkingLot> topParkingLots = parkingLotDAO.getTopParkingLots();


        // Create data sources
        JRBeanCollectionDataSource driversDataSource = new JRBeanCollectionDataSource(topDrivers);
        JRBeanCollectionDataSource lotsDataSource = new JRBeanCollectionDataSource(topParkingLots);



        // Compile and generate the report
        try {
            Map<String, Object> parameters1 = new HashMap<>();
            parameters1.put("driversDataSource", new JRBeanCollectionDataSource(topDrivers));

            Map<String,Object>parameters2=new HashMap<>();
            parameters2.put("lotsDataSource", new JRBeanCollectionDataSource(topParkingLots));
            JasperReport jasperReport1 = JasperCompileManager.compileReport(path1);
            JasperReport jasperReport2=JasperCompileManager.compileReport(path2);
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(jasperReport1, parameters1, new JREmptyDataSource());
            JasperPrint jasperPrint2=JasperFillManager.fillReport(jasperReport2,parameters2,new JREmptyDataSource());
            JasperExportManager.exportReportToPdfFile(jasperPrint1, "AdminDriversReport.pdf");
            JasperExportManager.exportReportToPdfFile(jasperPrint2,"AdminLotsReport.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
