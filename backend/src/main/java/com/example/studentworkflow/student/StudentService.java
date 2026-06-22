package com.example.studentworkflow.student;

import com.example.studentworkflow.student.dto.CreateStudentRequest;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    public static final String PROCESS_KEY = "student-approval";

    private final StudentRepository studentRepository;
    private final RuntimeService runtimeService;
    private final TaskService taskService;

    public StudentService(StudentRepository studentRepository,
                          RuntimeService runtimeService,
                          TaskService taskService) {
        this.studentRepository = studentRepository;
        this.runtimeService = runtimeService;
        this.taskService = taskService;
    }

    /**
     * Assistant action: persist the student in CREATE state and kick off the
     * Camunda approval process. The process immediately parks on the admin
     * approval user task.
     */
    @Transactional
    public Student createStudent(CreateStudentRequest request, String createdBy) {
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setCourse(request.getCourse());
        student.setStatus(StudentStatus.CREATE);
        student.setCreatedBy(createdBy);
        student = studentRepository.save(student);

        Map<String, Object> vars = new HashMap<>();
        vars.put("studentId", student.getId());
        vars.put("studentName", student.getName());

        ProcessInstance instance = runtimeService.startProcessInstanceByKey(
                PROCESS_KEY, "student-" + student.getId(), vars);

        student.setProcessInstanceId(instance.getId());
        return studentRepository.save(student);
    }

    /**
     * Admin action: complete the open approval task for this student. The
     * BPMN then runs a service task that flips the status to ACTIVE.
     */
    @Transactional
    public Student approveStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        if (student.getStatus() == StudentStatus.ACTIVE) {
            return student; // already approved, nothing to do
        }

        Task task = taskService.createTaskQuery()
                .processInstanceId(student.getProcessInstanceId())
                .taskDefinitionKey("Task_AdminApproval")
                .singleResult();

        if (task == null) {
            throw new IllegalStateException("No open approval task for student " + studentId);
        }

        taskService.complete(task.getId());
        // The ActivateStudentDelegate sets status = ACTIVE; reload to return fresh state.
        return studentRepository.findById(studentId).orElseThrow();
    }

    public List<Student> getPending() {
        return studentRepository.findByStatus(StudentStatus.CREATE);
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }
}
