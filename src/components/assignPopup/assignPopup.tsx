import React, { useState } from "react";
import { Member } from "../../services/memberService";
import "./assignPopup.css";

interface AssignPopupProps {
  members: Member[];
  taskCategory: string;
  onAssign: (memberName: string) => void;
  onClose: () => void;
}

const AssignPopup: React.FC<AssignPopupProps> = ({
  members,
  taskCategory,
  onAssign,
  onClose,
}) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = () => {
    if (!selectedMember) {
      setError("Please select a member to assign the task.");
      return;
    }
    onAssign(selectedMember);
    onClose();
  };

  const filteredMembers = members.filter(
    (member) =>
      member.role.charAt(0).toLowerCase() ===
      taskCategory.charAt(0).toLowerCase()
  );

  console.log("Filtered members:", filteredMembers);

  return (
    <div className="assign-popup">
      <div className="assign-popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Assign Task</h2>
        {error && <p className="error">{error}</p>}
        <div className="members-list">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div key={member.id} className="member-item">
                <input
                  type="checkbox"
                  id={member.id}
                  checked={selectedMember === member.name}
                  onChange={() => setSelectedMember(member.name)}
                />
                <label htmlFor={member.id}>
                  {member.name} - {member.role}
                </label>
              </div>
            ))
          ) : (
            <p>No members found for this category.</p>
          )}
        </div>
        <button onClick={handleAssign}>Assign</button>
      </div>
    </div>
  );
};

export default AssignPopup;
