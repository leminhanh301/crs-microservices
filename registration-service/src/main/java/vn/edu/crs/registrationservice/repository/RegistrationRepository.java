package vn.edu.crs.registrationservice.repository;

import vn.edu.crs.registrationservice.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);
    List<Registration> findByStudentIdAndTrangThai(Long studentId, String trangThai);
    boolean existsByStudentIdAndCourseIdAndTrangThai(Long studentId, Long courseId, String trangThai);
}