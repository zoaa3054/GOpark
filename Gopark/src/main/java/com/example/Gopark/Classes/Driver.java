package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Driver {
    private Long id;
    private String driverUsername;
    private String password;
    private String email;
    private String phone;
    private String carPlate;
}