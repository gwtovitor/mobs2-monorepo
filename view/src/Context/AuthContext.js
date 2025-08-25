import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(
		() => localStorage.getItem('token') || null
	);
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (token) localStorage.setItem('token', token);
		else localStorage.removeItem('token');
	}, [token]);

	const value = useMemo(
		() => ({
			token,
			setToken,
			user,
			setUser,
			logout: () => setToken(null),
		}),
		[token, user]
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthCtx);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
