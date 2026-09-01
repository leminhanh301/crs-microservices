package vn.edu.crs.courseService.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseService.dto.CourseDTO;
import vn.edu.crs.courseService.service.CourseService;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public Page<CourseDTO> search(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return courseService.search(keyword, pageable);
    }

    @GetMapping("/{id}")
    public CourseDTO getById(@PathVariable Long id) {
        return courseService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        return courseService.create(courseDTO);
    }

    @PutMapping("/{id}")
    public CourseDTO updateCourse(@PathVariable Long id, @RequestBody CourseDTO courseDTO) {
        return courseService.update(id, courseDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
    }
}
