package com.example.Gopark.Controllers;


import com.example.Gopark.Classes.Administrator;
import com.example.Gopark.Services.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/system/admin")
public class AdministratorController {

    @Autowired
    AdministratorService administratorService;

    @GetMapping("/login")
    public Administrator getAdmin(@RequestHeader("Email") String emailAddress, @RequestHeader("Password") String password) {
        return administratorService.getAdmin(emailAddress, password);
    }
}
