import { useAuth } from './Context/AuthContext';
import LoginPage from './View/LoginPage/LoginPage';
import Dashboard from './View/HomePage/HomePage';
import SignupPage from './View/SignupPage/SignupPage';
import { useState } from 'react';
import './index.css';

export default function App() {
	const { token } = useAuth();
	const [mode, setMode] = useState('login');

	if (token) return <Dashboard />;

	return mode === 'login' ? (
		<LoginPage onSwitchToSignup={() => setMode('signup')} />
	) : (
		<SignupPage onSwitchToLogin={() => setMode('login')} />
	);
}
