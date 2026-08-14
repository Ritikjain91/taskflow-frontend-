import { useEffect, useState, useCallback } from 'react';
import type { Board, Task, Priority } from './types';
import * as api from './api/client';
import Column from './components/Column';
import FilterBar from './components/FilterBar';
import TaskModal from './components/TaskModal';
import './styles/index.css';

// Single-board app — the seed script always creates board #1. Multi-board
// support (a board picker) is called out as a possible future step in the README.
const BOARD_ID = 1;

type ModalState = { mode: 'create'; columnId: number } | { mode: 'edit'; task: Task } | null;

export default function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState<ModalState>(null);

  const loadBoard = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchBoard(BOARD_ID, priorityFilter);
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  async function handleCreate(data: { title: string; description?: string; priority: Priority }) {
    if (!modalState || modalState.mode !== 'create') return;
    try {
      setError(null);
      await api.createTask({ column_id: modalState.columnId, ...data });
      setModalState(null);
      await loadBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  }

  async function handleEdit(data: { title: string; description?: string; priority: Priority }) {
    if (!modalState || modalState.mode !== 'edit') return;
    try {
      setError(null);
      await api.updateTask(modalState.task.id, data);
      setModalState(null);
      await loadBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }

  async function handleMove(taskId: number, columnId: number) {
    // Optimistic update so the dropdown feels instant; we reconcile with the
    // server response (or roll back via loadBoard) right after.
    try {
      setError(null);
      await api.moveTask(taskId, columnId);
      await loadBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
      await loadBoard();
    }
  }

  async function handleDelete(taskId: number) {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      setError(null);
      await api.deleteTask(taskId);
      await loadBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  if (loading) {
    return <div className="state-message">Loading board…</div>;
  }

  if (!board) {
    return (
      <div className="state-message state-error">
        <p>{error || 'Could not load the board.'}</p>
        <button onClick={loadBoard}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-title">
          <span className="app-mark">TF</span>
          <h1>{board.name}</h1>
        </div>
        <FilterBar
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </header>

      {error && (
        <div className="banner banner-error" role="alert">
          <span>{error}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <main className="board">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            allColumns={board.columns}
            search={search}
            onAddTask={() => setModalState({ mode: 'create', columnId: col.id })}
            onEditTask={(task) => setModalState({ mode: 'edit', task })}
            onMoveTask={handleMove}
            onDeleteTask={handleDelete}
          />
        ))}
      </main>

      {modalState && (
        <TaskModal
          mode={modalState.mode}
          initialTask={modalState.mode === 'edit' ? modalState.task : undefined}
          onCancel={() => setModalState(null)}
          onSubmit={modalState.mode === 'create' ? handleCreate : handleEdit}
        />
      )}
    </div>
  );
}
