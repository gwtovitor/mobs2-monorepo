import { apiFetch } from './apiClient';

export async function login(email, password) {
  return apiFetch('/login', { method: 'POST', body: { email, password } });
}

export async function signup(name, email, password) {
  return apiFetch('/signup', { method: 'POST', body: { name, email, password } });
}
