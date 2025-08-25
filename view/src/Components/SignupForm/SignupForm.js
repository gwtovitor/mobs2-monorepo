import { useState } from 'react';
import { signup, login } from '../../Services/auth';
import { useAuth } from '../../Context/AuthContext';
import styles from './signupForm.module.scss'

export default function SignupForm({ onSwitchToLogin }) {
	const { setToken } = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [err, setErr] = useState('');
	const [loading, setLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setErr('');
		if (password !== confirm) {
			setErr('Passwords do not match');
			return;
		}
		setLoading(true);
		try {
			await signup(name, email, password);
			const { accessToken } = await login(email, password);
			setToken(accessToken);
		} catch (e) {
			setErr(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className={styles.signup} onSubmit={onSubmit}>
			<h2>Create account</h2>
			<label>Name</label>
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				type="text"
				required
			/>

			<label>Email</label>
			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				type="email"
				required
			/>

			<label>Password</label>
			<input
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				required
			/>

			<label>Confirm password</label>
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
