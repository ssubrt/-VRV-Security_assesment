// Update the API_BASE_URL to use absolute URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  roleId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  status?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return response.json();
}

export async function fetchRoles() {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch roles');
  return response.json();
}

export async function fetchRole(id: string) {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch role');
  return response.json();
}

export async function createRole(data: {
  name: string;
  description?: string;
  permissions: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create role');
  return response.json();
}

export async function updateRole(id: string, data: {
  name?: string;
  description?: string;
  permissions?: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update role');
  return response.json();
}

export async function deleteRole(id: string) {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete role');
  return response.json();
}

export async function fetchPermissions() {
  const response = await fetch(`${API_BASE_URL}/permissions`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch permissions');
  return response.json();
}

export async function fetchActivities() {
  const response = await fetch(`${API_BASE_URL}/activities`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch activities');
  return response.json();
}

export async function login(credentials: { 
  email: string; 
  password: string;
  loginAs: 'admin' | 'user';
}) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Invalid credentials');
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to logout');
  return response.json();
}