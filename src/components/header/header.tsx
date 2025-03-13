import React, { useState, useRef, useEffect } from "react";
import { addMember } from "../../services/memberService";
import { addTask } from "../../services/taskService";
import { getCategories, getMembers } from "../../services/filterService";
import "./header.css";

interface HeaderProps {
  onFilterCategory: (category: string | null) => void;
  onFilterMember: (member: string | null) => void;
  onSort: (sortBy: "timestamp" | "title") => void; // Add onSort prop
}

const Header: React.FC<HeaderProps> = ({ onFilterCategory, onFilterMember, onSort }) => {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for dropdowns and popups
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const memberFormRef = useRef<HTMLDivElement>(null);
  const taskFormRef = useRef<HTMLDivElement>(null);

  // Fetch categories and members on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedMembers] = await Promise.all([
          getCategories(),
          getMembers(),
        ]);
        setCategories(fetchedCategories);
        setMembers(fetchedMembers.map((member) => member.name));
      } catch (error) {
        console.error("Error fetching data: ", error);
        setErrorMessage("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Handle clicks outside dropdowns and popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }

      if (
        memberFormRef.current &&
        !memberFormRef.current.contains(event.target as Node)
      ) {
        setShowMemberForm(false);
      }

      if (
        taskFormRef.current &&
        !taskFormRef.current.contains(event.target as Node)
      ) {
        setShowTaskForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;

    try {
      await addMember({ name, role });
      setSuccessMessage("Member added successfully!");
      setTimeout(() => {
        setShowMemberForm(false);
        setSuccessMessage(null);
      }, 2000);
      form.reset();
    } catch (error) {
      console.error("Error adding member: ", error);
      setErrorMessage("Failed to add member. Please try again.");
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      .value;

    try {
      await addTask({
        title,
        description,
        category,
        status: "new",
        timestamp: new Date(),
        assignedTo: null,
      });
      setSuccessMessage("Task added successfully!");
      setTimeout(() => {
        setShowTaskForm(false);
        setSuccessMessage(null);
      }, 2000);
      form.reset();
    } catch (error) {
      console.error("Error adding task: ", error);
      setErrorMessage("Failed to add task. Please try again.");
    }
  };

  const handleFilterCategory = (category: string | null) => {
    onFilterCategory(category);
    setShowCategoryDropdown(false);
    setShowFilterDropdown(false);
  };

  const handleFilterMember = (member: string | null) => {
    onFilterMember(member);
    setShowMemberDropdown(false);
    setShowFilterDropdown(false);
  };

  return (
    <header>
      <h1 className="title">Scrum Board</h1>
      <nav className="navbar">
        <button onClick={() => setShowMemberForm(true)}>
          Add New Team Member
        </button>
        <button onClick={() => setShowTaskForm(true)}>Add New Task</button>
        <div className="dropdown" ref={filterDropdownRef}>
          <button onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
            Filter Tasks
          </button>
          {showFilterDropdown && (
            <div className="dropdown-content">
              <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                Filter by Category
              </button>
              {showCategoryDropdown && (
                <div className="side-dropdown">
                  <button onClick={() => handleFilterCategory(null)}>All Categories</button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setShowMemberDropdown(!showMemberDropdown)}>
                Filter by Team Member
              </button>
              {showMemberDropdown && (
                <div className="side-dropdown">
                  <button onClick={() => handleFilterMember(null)}>All Members</button>
                  {members.map((member) => (
                    <button
                      key={member}
                      onClick={() => handleFilterMember(member)}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="dropdown" ref={sortDropdownRef}>
          <button onClick={() => setShowSortDropdown(!showSortDropdown)}>
            Sort Tasks
          </button>
          {showSortDropdown && (
            <div className="dropdown-content">
              <button onClick={() => onSort("timestamp")}>Sort by Timestamp</button>
              <button onClick={() => onSort("title")}>Sort by Title</button>
            </div>
          )}
        </div>
      </nav>

      {}
      {showMemberForm && (
        <div className="popup">
          <div className="popup-content" ref={memberFormRef}>
            <button
              className="close-btn"
              onClick={() => setShowMemberForm(false)}
            >
              ×
            </button>
            <h2>Add New Team Member</h2>
            <form onSubmit={handleMemberSubmit}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                required
              />
              <label>Role:</label>
              <select name="role" required>
                <option value="UX Designer">UX Designer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
              </select>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Popup for Add New Task */}
      {showTaskForm && (
        <div className="popup">
          <div className="popup-content" ref={taskFormRef}>
            <button
              className="close-btn"
              onClick={() => setShowTaskForm(false)}
            >
              ×
            </button>
            <h2>Add New Task</h2>
            <form onSubmit={handleTaskSubmit}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                required
              />
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Enter description"
                required
              ></textarea>
              <label>Category:</label>
              <select name="category" required>
                <option value="UX">UX</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
              </select>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </header>
  );
};

export default Header;