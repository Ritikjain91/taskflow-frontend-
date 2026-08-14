import type { Board, Task, Priority } from '../types';

// In local dev, VITE_API_URL is left unset and requests go to the relative
// '/api' path, which Vite's dev server proxies to http://localhost:4000
// (see vite.config.ts). In production (e.g. deployed on Vercel), the
// frontend and backend live on different domains, so VITE_API_URL is set
// to the deployed backend's URL (e.g. https://taskflow-backend-027e.onrender.com/api)
// as an environment variable in the Vercel project settings.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // Network failure (server down, no connection, etc.)
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // Response wasn't JSON — keep the generic message.
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function fetchBoard(boardId: number, priority?: Priority | 'All'): Promise<Board> {
  const query = priority && priority !== 'All' ? `?priority=${priority}` : '';
  return request<Board>(`/boards/${boardId}${query}`);
}

export function createTask(data: {
  column_id: number;
  title: string;
  description?: string;
  priority?: Priority;
}): Promise<Task> {
  return request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTask(
  id: number,
  data: { title?: string; description?: string; priority?: Priority }
): Promise<Task> {
  return request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function moveTask(id: number, columnId: number): Promise<Task> {
  return request<Task>(`/tasks/${id}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ column_id: columnId }),
  });
}

export function deleteTask(id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' });
}
