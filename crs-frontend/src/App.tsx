import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AdminCoursesPage } from './pages/AdminCoursesPage';
import { CoursesPage } from './pages/CoursesPage';
import { LoginPage } from './pages/LoginPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { RegisterCoursePage } from './pages/RegisterCoursePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
            <Route path="/register-course" element={<RegisterCoursePage />} />
            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
