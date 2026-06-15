const BASE_URL = '/api'

async function request(path, options = {}, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(err.message || `Error ${res.status}`)
  }

  return res.json()
}

export const notesApi = {
  getAll: (token) => request('/notes', {}, token),

  create: (data, token) =>
    request('/notes', { method: 'POST', body: JSON.stringify(data) }, token),

  update: (id, data, token) =>
    request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  delete: (id, token) =>
    request(`/notes/${id}`, { method: 'DELETE' }, token),
}
