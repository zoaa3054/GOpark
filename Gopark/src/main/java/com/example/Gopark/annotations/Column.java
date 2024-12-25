package com.example.Gopark.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE})
public @interface Column {
    String name();
    boolean nullable() default false;
    boolean unique() default false;
    String defaultValue() default "";
    boolean autoIncrement() default false;
    int length() default 255;
}  

