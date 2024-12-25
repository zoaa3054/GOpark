package com.example.Gopark.Controllers;


import com.example.Gopark.Classes.Driver;
import com.example.Gopark.Services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/driver")
public class DriverController {
    @Autowired
    DriverService driverService;

    @PostMapping("/signUp")
    public Driver addNeWDriver(@RequestBody Driver driver) {
        return driverService.addnewDriver(driver);
    }

    @GetMapping("/login")
    public Driver addNeWDriver(@RequestParam String emailAddress, @RequestParam String password) {
        return driverService.getDriver(emailAddress, password);
    }
}
