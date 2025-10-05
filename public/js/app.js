const API_BASE = `${location.protocol}//${location.host}/api`;

// ── Helpers de auth ──────────────────────────────────────────────
export function saveToken(token) {
  sessionStorage.setItem('token', token);
}

export function getToken() {
  return sessionStorage.getItem('token');
}

export function clearToken() {
  sessionStorage.removeItem('token');
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(url, { ...options, headers });
  // Si expiró o no autorizado ⇒ a SignIn
  if (res.status === 401) {
    clearToken();
    location.href = '/signIn';
    return;
  }
  return res;
}

export async function getMe() {
  const res = await fetchWithAuth(`${API_BASE}/users/me`);
  if (!res || !res.ok) throw new Error('No se pudo obtener el perfil');
  return res.json();
}

export function ensureAuthOrRedirect() {
  const token = getToken();
  if (!token) {
    location.href = '/signIn';
  }
}

export function hasRole(user, role) {
  return (user?.roles || []).includes(role);
}

export function calcAge(isoDateString) {
  const d = new Date(isoDateString);
  const diff = Date.now() - d.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}
