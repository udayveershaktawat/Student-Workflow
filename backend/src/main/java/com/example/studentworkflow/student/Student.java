package com.example.studentworkflow.student;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "students")
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status = StudentStatus.CREATE;

    /** Keycloak username of the assistant who created the record. */
    private String createdBy;

    /** Camunda process instance handling this student's approval. */
    private String processInstanceId;

    private Instant createdAt = Instant.now();

    
}
