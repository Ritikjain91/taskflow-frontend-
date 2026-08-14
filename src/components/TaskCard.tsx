import type { Task, Column } from '../types';

interface Props {
  task: Task;
  columns: Column[];
  onEdit: () => void;
  onMove: (columnId: number) => void;
  onDelete: () => void;
}

const PRIORITY_CLASS: Record<Task['priority'], string> = {
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high',
};

export default function TaskCard({ task, columns, onEdit, onMove, onDelete }: Props) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`priority-badge ${PRIORITY_CLASS[task.priority]}`}>{task.priority}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-actions">
        <select
          value={task.column_id}
          onChange={(e) => onMove(Number(e.target.value))}
          aria-label={`Move "${task.title}" to a different column`}
        >
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
