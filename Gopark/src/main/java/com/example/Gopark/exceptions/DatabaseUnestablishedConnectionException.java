package com.example.Gopark.exceptions;

public class DatabaseUnestablishedConnectionException extends NullPointerException {
    public DatabaseUnestablishedConnectionException(String message) {
        super(message);
    }
}
