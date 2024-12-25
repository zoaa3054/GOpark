package com.example.Gopark.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface Relation {
    String name();
    String onDelete() default "NO ACTION";
    String onUpdate() default "NO ACTION";
}
