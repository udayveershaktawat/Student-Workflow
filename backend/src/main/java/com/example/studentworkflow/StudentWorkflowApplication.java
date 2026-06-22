package com.example.studentworkflow;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableProcessApplication
public class StudentWorkflowApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentWorkflowApplication.class, args);
    }
}
