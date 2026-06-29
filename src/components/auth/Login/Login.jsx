import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(loginValue, password);
    if (res.ok) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.brand}>
          <i className="ti ti-tooth" />
          <span>DentaMetrics</span>
        </div>
        <p className={styles.subtitle}>Вход в систему аналитики отзывов</p>

        <label className={styles.label} htmlFor="login">Логин</label>
        <input
          id="login"
          className={styles.input}
          type="text"
          autoComplete="username"
          value={loginValue}
          onChange={(e) => { setLoginValue(e.target.value); setError(''); }}
          placeholder="admin"
        />

        <label className={styles.label} htmlFor="password">Пароль</label>
        <div className={styles.passwordWrap}>
          <input
            id="password"
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
          />
          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="ti ti-alert-circle" />
            {error}
          </div>
        )}

        <button type="submit" className={styles.submit}>Войти</button>

        <div className={styles.hint}>
          Демо-доступы: <b>admin / admin123</b> (Администратор) · <b>user / user123</b> (Пользователь)
        </div>
      </form>
    </div>
  );
}
