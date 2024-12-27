package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Violation {
    int id;
    String type;
    double penalty;
    boolean paid;
    int reservationId;
}