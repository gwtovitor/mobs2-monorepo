import { apiFetch } from "./apiClient";

export async function listVehicles(token) {
  return apiFetch('/vehicles', { token });
}

export async function getVehicleByPlate(token, plate) {
  return apiFetch(`/vehicles/${encodeURIComponent(plate)}`, { token });
}

export async function createVehicle(token, payload) {
  return apiFetch('/vehicles', { method: 'POST', body: payload, token });
}

export async function updateVehicle(token, plate, payload) {
  return apiFetch(`/vehicles/${encodeURIComponent(plate)}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function deleteVehicle(token, plate) {
  return apiFetch(`/vehicles/${encodeURIComponent(plate)}`, {
    method: 'DELETE',
    token,
  });
}
