package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Driver {
    private Long id;
    private String driver_username;
    private String password;
    private String email;
    private String phone;
    private String car_Plate;
}
