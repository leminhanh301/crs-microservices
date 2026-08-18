package vn.edu.crs.courseservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "course")
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenMonHoc;
    private int soTinChi;
    private int soChoToiDa;
    private int soChoConLai;
}