package vn.edu.crs.courseservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseDTO {
    private Long id;

    @NotBlank(message = "Ten mon hoc khong duoc de trong")
    private String tenMonHoc;

    @NotNull(message = "So tin chi khong duoc de trong")
    @Min(value = 1, message = "So tin chi phai lon hon 0")
    private Integer soTinChi;

    @NotNull(message = "So cho toi da khong duoc de trong")
    @Min(value = 1, message = "So cho toi da phai lon hon 0")
    private Integer soChoToiDa;

    // Khong bat buoc client gui khi tao moi; se tu gan = soChoToiDa trong Service
    private Integer soChoConLai;

    // --- Constructor không tham số ---
    public CourseDTO() {
    }

    // --- Constructor đầy đủ tham số ---
    public CourseDTO(Long id, String tenMonHoc, Integer soTinChi, Integer soChoToiDa, Integer soChoConLai) {
        this.id = id;
        this.tenMonHoc = tenMonHoc;
        this.soTinChi = soTinChi;
        this.soChoToiDa = soChoToiDa;
        this.soChoConLai = soChoConLai;
    }

    // --- Getters và Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenMonHoc() {
        return tenMonHoc;
    }

    public void setTenMonHoc(String tenMonHoc) {
        this.tenMonHoc = tenMonHoc;
    }

    public Integer getSoTinChi() {
        return soTinChi;
    }

    public void setSoTinChi(Integer soTinChi) {
        this.soTinChi = soTinChi;
    }

    public Integer getSoChoToiDa() {
        return soChoToiDa;
    }

    public void setSoChoToiDa(Integer soChoToiDa) {
        this.soChoToiDa = soChoToiDa;
    }

    public Integer getSoChoConLai() {
        return soChoConLai;
    }

    public void setSoChoConLai(Integer soChoConLai) {
        this.soChoConLai = soChoConLai;
    }
}