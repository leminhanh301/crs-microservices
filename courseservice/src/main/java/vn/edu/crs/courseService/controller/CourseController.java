package vn.edu.crs.courseService.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseService.dto.CourseDTO;
import vn.edu.crs.courseService.service.CourseService;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // Buổi 3: Thay endpoint GET /courses từ List sang Page, hỗ trợ search + phân trang + sort
    @GetMapping
    public Page<CourseDTO> search(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return courseService.search(keyword, pageable);
    }

    @PostMapping
    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        return courseService.create(courseDTO);
    }
}