package com.example.studentmanagement;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository repository;

    public DataInitializer(StudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Student("Alice", 20, "Computer Science"));
            repository.save(new Student("Bob", 22, "Mechanical Engineering"));
            repository.save(new Student("Clara", 21, "Electronics"));
            System.out.println("✅ Sample student data initialized into database.");
        }
    }
}
