package vn.edu.crs.courseService.service;

import vn.edu.crs.courseService.dto.CourseDTO;
import vn.edu.crs.courseService.entity.Course;
import vn.edu.crs.courseService.repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDTO> getAll() {
        return courseRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Buổi 3: Thêm phương thức search hỗ trợ phân trang
    public Page<CourseDTO> search(String keyword, Pageable pageable) {
        Page<Course> page = (keyword == null || keyword.isBlank()) ?
                courseRepository.findAll(pageable) :
                courseRepository.findByTenMonHocContainingIgnoreCase(keyword, pageable);
        return page.map(this::toDTO);
    }

    public CourseDTO getById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));
        return toDTO(course);
    }

    public CourseDTO create(CourseDTO dto) {
        if (courseRepository.existsByTenMonHocIgnoreCase(dto.getTenMonHoc())) {
            throw new IllegalArgumentException("Ten mon hoc da ton tai");
        }
        Course course = new Course();
        course.setTenMonHoc(dto.getTenMonHoc());
        course.setSoTinChi(dto.getSoTinChi());
        course.setSoChoToiDa(dto.getSoChoToiDa());
        course.setSoChoConLai(dto.getSoChoToiDa());
        return toDTO(courseRepository.save(course));
    }

    @Transactional
    public CourseDTO reserveSeat(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + courseId));
        if (course.getSoChoConLai() <= 0) {
            throw new IllegalStateException("Mon hoc da het cho, khong the dang ky");
        }
        course.setSoChoConLai(course.getSoChoConLai() - 1);
        return toDTO(courseRepository.save(course));
    }

    @Transactional
    public CourseDTO releaseSeat(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + courseId));
        if (course.getSoChoConLai() < course.getSoChoToiDa()) {
            course.setSoChoConLai(course.getSoChoConLai() + 1);
        }
        return toDTO(courseRepository.save(course));
    }

    private CourseDTO toDTO(Course course) {
        return new CourseDTO(course.getId(), course.getTenMonHoc(), course.getSoTinChi(), course.getSoChoToiDa(), course.getSoChoConLai());
    }
}