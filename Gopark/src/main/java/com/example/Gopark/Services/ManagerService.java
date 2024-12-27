package com.example.Gopark.Services;

import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.Manager;
import com.example.Gopark.DAOS.DriverDAO;
import com.example.Gopark.DAOS.ManagerDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {
    @Autowired
    ManagerDAO managerDAO;

    public Manager getManager(String emailAddress, String password) {
        return managerDAO.login(emailAddress, password);
    }

    public Manager addnewManager(Manager manager) {
        return managerDAO.insertManager(manager);
    }
}
