import keycloak from './keycloak';

const BASE = 'http://localhost:8080/api';

async function authFetch(path, options = {}) {
  // Refresh the token if it's close to expiry, then attach it.
  await keycloak.updateToken(30).catch(() => keycloak.login());

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keycloak.token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  // Some endpoints may return empty bodies.
  const body = await res.text();
  return body ? JSON.parse(body) : null;
}

export const api = {
  createStudent: (student) =>
    authFetch('/students', { method: 'POST', body: JSON.stringify(student) }),
  getPending: () => authFetch('/students/pending'),
  approve: (id) => authFetch(`/students/${id}/approve`, { method: 'POST' }),
  getAll: () => authFetch('/students'),
};
