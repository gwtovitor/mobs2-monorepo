import { useState } from 'react';
import { signup, login } from '../../Services/auth';
import { useAuth } from '../../Context/AuthContext';
import styles from './signupForm.module.scss';

export default function SignupForm({ onSwitchToLogin }) {
  const { setToken } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function isValidEmail(v) {
    // regex simples e suficiente para a maioria dos casos
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function isStrongPassword(v) {
    // pelo menos 8, 1 minúscula, 1 maiúscula, 1 número e 1 símbolo
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);
  }

  function hasAtLeastTwoNames(v) {
    const parts = v.trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2;
  }

  function validateInputs() {
    if (!hasAtLeastTwoNames(name)) {
      return { ok: false, message: 'Name must contain at least two words.' };
    }
    if (!isValidEmail(email)) {
      return { ok: false, message: 'Please enter a valid email address.' };
    }
    if (!isStrongPassword(password)) {
      return {
        ok: false,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
      };
    }
    if (password !== confirm) {
      return { ok: false, message: 'Passwords do not match.' };
    }
    return { ok: true };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');

    const { ok, message } = validateInputs();
    if (!ok) {
      setErr(message);
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      const { accessToken } = await login(email, password);
      setToken(accessToken);
    } catch (e) {
      setErr(e.message || 'Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.signup} onSubmit={onSubmit} noValidate>
      <h2>Create account</h2>

      <label>
        Name
        <span className={styles.help}>
          (At least two words, e.g., “John Doe”)
        </span>
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        required
        aria-describedby="name-help"
      />

      <label>
        Email
        <span className={styles.help}>
          (Use a valid email format, e.g., user@example.com)
        </span>
      </label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        aria-describedby="email-help"
      />

      <label>
        Password
        <span className={styles.help}>
          (Min 8 chars, include uppercase, lowercase, number and symbol)
        </span>
      </label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        aria-describedby="password-help"
      />

      <label>
        Confirm password
        <span className={styles.help}>(Must match the password)</span>
      </label>
      <input
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        type="password"
        required
      />

      {err && <p className={styles.error}>{err}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Sign up'}
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className={styles.switchBt}
      >
        I already have an account
      </button>
    </form>
  );
}
