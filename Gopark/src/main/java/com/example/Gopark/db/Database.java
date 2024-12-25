package com.example.Gopark.db;

import org.jetbrains.annotations.NotNull;
import org.reflections.Reflections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.example.Gopark.annotations.Column;
import com.example.Gopark.annotations.PK;
import com.example.Gopark.annotations.Relation;
import com.example.Gopark.exceptions.DatabaseUnestablishedConnectionException;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Database {
    private static volatile Database db;
    private final Connection connection;



    private Database(JdbcTemplate jdbcTemplate) throws SQLException {
        this.connection = jdbcTemplate.getDataSource().getConnection();
        this.initializeDB(jdbcTemplate);
    }


    public static Database getDb(JdbcTemplate jdbcTemplate) throws SQLException {
        Database instance = db;
        if (instance == null){
            synchronized (Database.class){
                instance = db;
                if (instance == null)
                    instance = new Database(jdbcTemplate);
            }
        }
        return instance;
    }


    public static void closeConnection() {
        if (db != null) {
            try {
                db.connection.close();
                System.out.println("Database connection closed");
                db = null;
            } catch (SQLException e) {
                throw new RuntimeException("Failed to close the database connection", e);
            }
        }
    }

    public static void setAutoCommit(boolean autoCommit) {
        try {
            if (db != null) {
                db.connection.setAutoCommit(autoCommit);
            } else {
                throw new DatabaseUnestablishedConnectionException("Database connection is not established");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to set auto-commit mode", e);
        }
    }

    public boolean executeSQLStatement(String sql) throws SQLException {
        boolean doneSuccessfully = false;
        try (Statement statement = connection.createStatement()) {
            if(statement.execute(sql)){
                System.out.println("SQL Statement executed successfully");
                doneSuccessfully = true;
            }
        }
        return doneSuccessfully;
    }

    private static void initializeDB(JdbcTemplate jdbcTemplate) throws SQLException {
        db = getDb(jdbcTemplate);
        
        Reflections reflections = new Reflections("com.example.Gopark");
        Set<Class<?>> relationClasses = reflections.getTypesAnnotatedWith(Relation.class);

        for (Class<?> clazz : relationClasses) {
            if (clazz.isAnnotationPresent(Relation.class)) {
                Relation relation = clazz.getAnnotation(Relation.class);
                String tableName = relation.name();

                StringBuilder createTableQuery = new StringBuilder();
                StringBuilder pkStatement = new StringBuilder();
                createTableQuery.append("CREATE TABLE IF NOT EXISTS ").append(tableName).append(" (");
                boolean hasPK = false;
                Field[] fields = clazz.getDeclaredFields();
                List<String> uniques = new ArrayList<>();
                for (Field field : fields) {
                    if (field.isAnnotationPresent(Column.class)) {
                        Column column = field.getAnnotation(Column.class);
                        String columnName = column.name();
                        String columnType = db.mapJavaTypeToSQLType(field.getType());
                        createTableQuery.append(columnName).append(" ").append(columnType);
                        if(!hasPK && field.isAnnotationPresent(PK.class)){
                            PK pk =  field.getAnnotation(PK.class);
                            hasPK = true;
                            if (pk.autoIncrement())
                                pkStatement.append("ALTER TABLE ").append(tableName).append(" AUTO_INCREMENT = 1;\n");
                            
                            pkStatement.append("ALTER TABLE ").append(tableName).append(" ADD PRIMARY KEY (").append(columnName).append(");");
                        }
                        if (column.nullable())
                            createTableQuery.append(" NOT NULL");
                        if (column.autoIncrement())
                            createTableQuery.append(" AUTO_INCREMENT");
                        if (column.unique())
                            uniques.add(columnName);
                        createTableQuery.append(", ");
                    }
                }

                // Remove trailing comma and space, and close the query
                createTableQuery.setLength(createTableQuery.length() - 2);
                createTableQuery.append(");");

                System.out.println("Executing Query: " + createTableQuery);

                if (db.executeSQLStatement(createTableQuery.toString()))
                    System.out.println("Table " + tableName + " created (if not exists).");
                else
                    System.err.println("Failed to create table " + tableName);
                
                if (hasPK) {
                    System.out.println("Executing Query: " + pkStatement);
                    if (db.executeSQLStatement(pkStatement.toString()))
                        System.out.println("Primary key for table " + tableName + " created.");
                    else
                        System.err.println("Failed to create primary key for table " + tableName);
                }

                for (String unique : uniques) {
                    StringBuilder uniqueStatement = new StringBuilder();
                    uniqueStatement.append("ALTER TABLE ").append(tableName).append(" ADD UNIQUE (").append(unique).append(");");
                    System.out.println("Executing Query: " + uniqueStatement);
                    if (db.executeSQLStatement(uniqueStatement.toString()))
                        System.out.println("Unique constraint for column " + unique + " created for table " + tableName + ".");
                    else
                        System.err.println("Failed to create unique constraint for column " + unique + " for table " + tableName);
                }
            }
        }
    }


    private String mapJavaTypeToSQLType(Class<?> javaType) {
        if (javaType == String.class) {
            return "VARCHAR(255)";
        } else if (javaType == int.class || javaType == Integer.class) {
            return "INT";
        } else if (javaType == long.class || javaType == Long.class) {
            return "BIGINT";
        } else if (javaType == double.class || javaType == Double.class) {
            return "DOUBLE";
        } else if (javaType == boolean.class || javaType == Boolean.class) {
            return "BOOLEAN";
        } else {
            throw new IllegalArgumentException("Unsupported Java type: " + javaType.getName());
        }
    }


}
