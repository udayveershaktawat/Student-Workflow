package com.example.studentworkflow.workflow;

import com.example.studentworkflow.student.Student;
import com.example.studentworkflow.student.StudentRepository;
import com.example.studentworkflow.student.StudentStatus;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

/**
 * Service task invoked by the BPMN process after the admin completes the
 * approval task. Flips the student's status to ACTIVE.
 *
 * Referenced from the BPMN as ${activateStudentDelegate}.
 */
@Component("activateStudentDelegate")
public class ActivateStudentDelegate implements JavaDelegate {

    private final StudentRepository studentRepository;

    public ActivateStudentDelegate(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void execute(DelegateExecution execution) {
        Long studentId = Long.valueOf(execution.getVariable("studentId").toString());
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalStateException("Student not found: " + studentId));
        student.setStatus(StudentStatus.ACTIVE);
        studentRepository.save(student);
    }
}
