import type { Priority } from '../types';

interface Props {
  priorityFilter: Priority | 'All';
  onPriorityChange: (value: Priority | 'All') => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({ priorityFilter, onPriorityChange, search, onSearchChange }: Props) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks by title…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks by title"
      />
      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value as Priority | 'All')}
        aria-label="Filter by priority"
      >
        <option value="All">All priorities</option>
        <option value="High">High priority</option>
        <option value="Medium">Medium priority</option>
        <option value="Low">Low priority</option>
      </select>
    </div>
  );
}
