import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/courses');
  };

  return (
    <nav style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}>
      <Link to="/courses">Môn học</Link>
      {user?.role === 'ADMIN' && <Link to="/admin/courses">Quản lý môn học</Link>}
      {user?.role === 'STUDENT' && (
        <>
          <Link to="/register-course">Đăng ký học phần</Link>
          <Link to="/my-registrations">Môn học đã đăng ký</Link>
        </>
      )}

      <span style={{ marginLeft: 'auto' }}>
        {isAuthenticated && user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.username} ({user.role})</span>
            <button type="button" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
      </span>
    </nav>
  );
};
