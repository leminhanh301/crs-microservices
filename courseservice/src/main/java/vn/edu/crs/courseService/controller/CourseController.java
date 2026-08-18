package vn.edu.crs.courseservice.controller;

import vn.edu.crs.courseservice.entity.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.repository.CourseRepository;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // Lấy danh sách môn học từ DB
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Thêm môn học mới vào DB (ADMIN)
    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }
}