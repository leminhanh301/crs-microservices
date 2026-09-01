import React, { useEffect, useState } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
  editingCourse: Course | null;
  onSubmit: (values: CourseFormValues) => void;
  onCancel: () => void;
  submitting: boolean;
  serverError: string | null;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  editingCourse,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}) => {
  const [formValues, setFormValues] = useState<CourseFormValues>(emptyCourseForm);
  const [clientErrors, setClientErrors] = useState<{
    tenMonHoc?: string;
    soTinChi?: string;
    soChoToiDa?: string;
  }>({});

  useEffect(() => {
    if (editingCourse) {
      setFormValues({
        tenMonHoc: editingCourse.tenMonHoc || '',
        soTinChi: editingCourse.soTinChi !== undefined ? String(editingCourse.soTinChi) : '',
        soChoToiDa: editingCourse.soChoToiDa !== undefined ? String(editingCourse.soChoToiDa) : '',
      });
    } else {
      setFormValues(emptyCourseForm);
    }
    setClientErrors({});
  }, [editingCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { tenMonHoc?: string; soTinChi?: string; soChoToiDa?: string } = {};

    if (!formValues.tenMonHoc.trim()) {
      errors.tenMonHoc = 'Tên môn học không được để trống';
    }

    const tinChi = Number(formValues.soTinChi);
    if (!formValues.soTinChi.trim() || isNaN(tinChi) || tinChi <= 0) {
      errors.soTinChi = 'Số tín chỉ phải lớn hơn 0';
    }

    const choToiDa = Number(formValues.soChoToiDa);
    if (!formValues.soChoToiDa.trim() || isNaN(choToiDa) || choToiDa <= 0) {
      errors.soChoToiDa = 'Số chỗ tối đa phải lớn hơn 0';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ccc', borderRadius: 4 }}>
      <h3>{editingCourse ? 'Sửa môn học' : 'Thêm môn học'}</h3>
      
      {serverError && (
        <div style={{ color: 'red', marginBottom: 10 }}>{serverError}</div>
      )}

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Tên môn học:</label>
        <input
          type="text"
          name="tenMonHoc"
          value={formValues.tenMonHoc}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
        {clientErrors.tenMonHoc && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{clientErrors.tenMonHoc}</span>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Số tín chỉ:</label>
        <input
          type="number"
          name="soTinChi"
          value={formValues.soTinChi}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
        {clientErrors.soTinChi && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{clientErrors.soTinChi}</span>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Số chỗ tối đa:</label>
        <input
          type="number"
          name="soChoToiDa"
          value={formValues.soChoToiDa}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
        {clientErrors.soChoToiDa && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{clientErrors.soChoToiDa}</span>
        )}
      </div>

      <div>
        <button type="submit" disabled={submitting} style={{ marginRight: 10, padding: '8px 16px' }}>
          {submitting ? 'Đang lưu...' : editingCourse ? 'Cập nhật' : 'Thêm mới'}
        </button>

        {editingCourse && (
          <button type="button" onClick={onCancel} disabled={submitting} style={{ padding: '8px 16px' }}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};
