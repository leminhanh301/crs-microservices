package vn.edu.crs.courseService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private Long id;
    private String tenMonHoc;
    private int soTinChi;
    private int soChoToiDa;
    private int soChoConLai;
}