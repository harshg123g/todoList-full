const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://todolist-full.onrender.com/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || 'Something went wrong');
  }

  return body;
}

export const todoApi = {
  getAll: ({ search = '', sort = 'desc', page = 1, limit = 10 }) =>
    request(
      `/todo/allTask?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}&limit=${limit}`
    ),

  add: (data) =>
    request('/todo/add', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    request(`/todo/updateTask/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  remove: (id) =>
    request(`/todo/deleteTask/${id}`, {
      method: 'DELETE'
    }),
};