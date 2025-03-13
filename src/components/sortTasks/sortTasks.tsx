import React from "react";
import "./sortTasks.css";

interface SortTasksProps {
  onSort: (sortBy: "timestamp" | "title") => void; 
}

const SortTasks: React.FC<SortTasksProps> = ({ onSort }) => {
  return (
    <div className="sort-tasks">
      <label>Sort by:</label>
      <select onChange={(e) => onSort(e.target.value as "timestamp" | "title")}>
        <option value="timestamp">Timestamp</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
};

export default SortTasks;