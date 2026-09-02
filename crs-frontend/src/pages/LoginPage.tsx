import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Đăng nhập thất bại.';
  }

  const data = error.response?.data;
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  return error.message || 'Đăng nhập thất bại.';
};

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await loginRequest({ username, password });
      login(response.data);
      navigate('/courses');
    } catch (error: unknown) {
      logout();
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</p>}
        <label style={{ display: 'block', marginBottom: 12 }}>
          Tên đăng nhập
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={submitting}
            required
            style={{ display: 'block', width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            required
            style={{ display: 'block', width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  );
};
