package com.example.Gopark.Services;

import com.example.Gopark.Classes.Driver;
import com.example.Gopark.DAOS.DriverDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverService {
    @Autowired
    DriverDAO driverDAO;
    public Driver addnewDriver(Driver driver) {
        return driverDAO.insertDriver(driver);
    }

    public Driver getDriver(String emailAddress, String password) {
        return driverDAO.login(emailAddress, password);
    }
}
