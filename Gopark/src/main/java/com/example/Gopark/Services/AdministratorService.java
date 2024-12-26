package com.example.Gopark.Services;

import com.example.Gopark.Classes.Administrator;
import com.example.Gopark.DAOS.AdministratorDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdministratorService {
    @Autowired
    AdministratorDAO administratorDAO;

    public Administrator getAdmin(String emailAddress, String password) {
        return administratorDAO.login(emailAddress, password);
    }
}
