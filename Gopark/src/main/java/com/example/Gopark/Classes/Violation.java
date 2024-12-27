package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Violation {
    private Long id;
    private String type;
    private Float penalty;
    private boolean paid;
    private Long reservationId;
}