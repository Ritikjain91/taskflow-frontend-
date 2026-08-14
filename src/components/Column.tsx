import type { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface Props {
  column: ColumnType;
  allColumns: ColumnType[];
  search: string;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (taskId: number, columnId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function Column({
  column,
  allColumns,
  search,
  onAddTask,
  onEditTask,
  onMoveTask,
  onDeleteTask,
}: Props) {
  const query = search.trim().toLowerCase();
  const visibleTasks = query
    ? column.tasks.filter((t) => t.title.toLowerCase().includes(query))
    : column.tasks;

  return (
    <section className="column">
      <header className="column-header">
        <h2>{column.name}</h2>
        <span className="task-count">{visibleTasks.length}</span>
      </header>

      <div className="task-list">
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columns={allColumns}
            onEdit={() => onEditTask(task)}
            onMove={(columnId) => onMoveTask(task.id, columnId)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
        {visibleTasks.length === 0 && (
          <p className="empty-hint">
            {column.tasks.length === 0 ? 'No tasks yet.' : 'No tasks match your filters.'}
          </p>
        )}
      </div>

      <button type="button" className="add-task-btn" onClick={onAddTask}>
        + Add task
      </button>
    </section>
  );
}
