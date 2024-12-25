package com.example.Gopark.Controllers;

import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Classes.Manager;
import com.example.Gopark.Services.DriverService;
import com.example.Gopark.Services.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/manager")
public class ManagerController {

    @Autowired
    ManagerService managerService;
    @PostMapping("/signUp")
    public Manager addNeWManager(@RequestBody Manager manager) {
        return managerService.addnewManager(manager);
    }
}
