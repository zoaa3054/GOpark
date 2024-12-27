package com.example.Gopark.Classes;

import lombok.Data;

@Data
public class Violation {
<<<<<<< HEAD
    int id;
    String type;
    double penalty;
    boolean paid;
    int reservationId;
}
=======
    private Long id;
    private String type; // Use an enum for better readability
    private Float penalty;
    private boolean paid; // Use a boolean for binary values
    private Long reservationId;
}
>>>>>>> origin/notifications
