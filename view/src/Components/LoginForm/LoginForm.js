import { useState } from 'react';
import { login } from '../../Services/auth';
import { useAuth } from '../../Context/AuthContext';
import styles from './loginForm.module.scss'

export default function LoginForm() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { accessToken } = await login(email, password);
      setToken(accessToken);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form className={styles.login} onSubmit={onSubmit}>
      <h2>Login</h2>
      <label>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
      {err && <p className={styles.error}>{err}</p>}
      <button type="submit">Enter</button>
    </form>
  );
}
