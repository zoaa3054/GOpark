package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.Manager;
import com.example.Gopark.Services.DriverService;
import com.example.Gopark.Services.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/lot/admins")
public class ManagerController {

    @Autowired
    ManagerService managerService;
    @PostMapping("/signUp")
    public Manager addNeWManager(@RequestBody Manager manager) {
        System.out.println(manager.toString());
        return managerService.addnewManager(manager);
    }

    @GetMapping("/login")
    public Manager getManager(@RequestHeader("Email") String emailAddress, @RequestHeader("Password") String password) {
        return managerService.getManager(emailAddress, password);
    }
}
