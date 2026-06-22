package com.example.studentworkflow.student;

import com.example.studentworkflow.student.dto.CreateStudentRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /** Assistant: create a new student (role check enforced in SecurityConfig). */
    @PostMapping
    public Student create(@RequestBody CreateStudentRequest request,
                          @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return studentService.createStudent(request, username);
    }

    /** Admin: list students awaiting approval. */
    @GetMapping("/pending")
    public List<Student> pending() {
        return studentService.getPending();
    }

    /** Admin: approve a student -> workflow flips status to ACTIVE. */
    @PostMapping("/{id}/approve")
    public Student approve(@PathVariable Long id) {
        return studentService.approveStudent(id);
    }

    /** Any authenticated user: full list. */
    @GetMapping
    public List<Student> all() {
        return studentService.getAll();
    }
}
