package vn.edu.crs.courseservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.service.CourseService;

@RestController
@RequestMapping("/internal/courses")
public class InternalCourseController {

    private final CourseService courseService;

    public InternalCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PatchMapping("/{id}/reserve-seat")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO reserveSeat(@PathVariable Long id) {
        return courseService.reserveSeat(id);
    }

    @PatchMapping("/{id}/release-seat")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO releaseSeat(@PathVariable Long id) {
        return courseService.releaseSeat(id);
    }
}
