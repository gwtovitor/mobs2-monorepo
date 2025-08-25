const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
	const headers = { 'Content-Type': 'application/json' };
	if (token) headers.Authorization = `Bearer ${token}`;
	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const msg = data?.error || `HTTP ${res.status}`;
		throw new Error(msg);
	}
	return data;
}
