package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Driver {
    private Long id;
    private String driverUserName;
    private String password;
    private String emailAddress;
    private String phoneNumber;
    private String carPlateNumber;
}
