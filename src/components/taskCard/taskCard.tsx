
import React, { useState } from "react";
import AssignPopup from "../assignPopup/assignPopup";
import { getMembers } from "../../services/memberService";
import { Member } from "../../services/memberService";
import "./taskCard.css";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    timestamp: Date;
    assignedTo?: string | null;
  };
  onAssign: (taskId: string, memberName: string) => void;
  onComplete: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAssign, onComplete, onDelete }) => {
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  const handleAssignClick = async () => {
    try {
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
      setShowAssignPopup(true);
    } catch (error) {
      console.error("Error fetching members: ", error);
    }
  };

  const handleAssign = (memberName: string) => {
    onAssign(task.id, memberName);
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Category: {task.category}</p>
      <p>Created: {task.timestamp.toLocaleString()}</p>
      {task.assignedTo && <p>Assigned to: {task.assignedTo}</p>}
      {task.status === "new" && (
        <button onClick={handleAssignClick}>Assign</button>
      )}
      {task.status === "in progress" && (
        <button onClick={onComplete}>Mark as Done</button>
      )}
      {task.status === "done" && <button onClick={onDelete}>Delete</button>}

      {showAssignPopup && (
        <AssignPopup
          members={members}
          taskCategory={task.category}
          onAssign={handleAssign}
          onClose={() => setShowAssignPopup(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;