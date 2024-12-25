package com.example.Gopark.DAOS;

import org.springframework.data.annotation.Id;

import com.example.Gopark.annotations.Column;
import com.example.Gopark.annotations.PK;
import com.example.Gopark.annotations.Relation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Relation(name = "DRIVER")
public class DriverDAO {

    @PK
    @Column(name = "id")
    private Long driverId;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phoneNumber;

    @Column(name = "plate")
    private String driverPlate;

}
