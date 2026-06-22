package com.example.studentworkflow.student;

/**
 * Lifecycle of a student record.
 * CREATE  - just entered by the Assistant, awaiting approval
 * ACTIVE  - approved by the Admin (set automatically by the Camunda workflow)
 */
public enum StudentStatus {
    CREATE,
    ACTIVE
}
