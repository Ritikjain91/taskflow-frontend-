import { useState, type FormEvent } from 'react';
import type { Task, Priority } from '../types';

interface Props {
  mode: 'create' | 'edit';
  initialTask?: Task;
  onCancel: () => void;
  onSubmit: (data: { title: string; description?: string; priority: Priority }) => void;
}

export default function TaskModal({ mode, initialTask, onCancel, onSubmit }: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'Medium');
  const [touched, setTouched] = useState(false);

  const titleIsEmpty = title.trim().length === 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (titleIsEmpty) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>{mode === 'create' ? 'New task' : 'Edit task'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              autoFocus
              aria-invalid={touched && titleIsEmpty}
            />
            {touched && titleIsEmpty && <span className="field-error">Title is required.</span>}
          </label>

          <label className="field">
            <span>Description (optional)</span>
            <textarea value={description ?? ''} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>

          <label className="field">
            <span>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {mode === 'create' ? 'Create task' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
