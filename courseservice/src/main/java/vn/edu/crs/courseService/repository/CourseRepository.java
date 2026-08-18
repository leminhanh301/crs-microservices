package vn.edu.crs.courseService.repository;

import vn.edu.crs.courseService.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByTenMonHocIgnoreCase(String tenMonHoc);

    // Buổi 3: Tìm kiếm phân trang theo tên môn học (không phân biệt hoa thường)
    Page<Course> findByTenMonHocContainingIgnoreCase(String keyword, Pageable pageable);
}