package com.example.studentworkflow.student.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStudentRequest {
    private String name;
    private String email;
    private String course;
    
}
