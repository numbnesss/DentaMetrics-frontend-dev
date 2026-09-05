export async function apiFetch(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'include' });

  if (response.status === 401 && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }

  return response;
}
