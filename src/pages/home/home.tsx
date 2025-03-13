import React, { useEffect, useState } from "react";
import TaskCard from "../../components/taskCard/taskCard";
import { getTasks, updateTask, deleteTask } from "../../services/taskService";
import { Task } from "../../types/task";
import "./home.css";

interface HomeProps {
  filterCategory: string | null;
  filterMember: string | null;
  sortBy: "timestamp" | "title"; 
}

const Home: React.FC<HomeProps> = ({
  filterCategory,
  filterMember,
  sortBy,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAssign = async (taskId: string, memberName: string) => {
    try {
      await updateTask(taskId, {
        status: "in progress",
        assignedTo: memberName,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "in progress", assignedTo: memberName }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error assigning task: ", error);
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        status: "done",
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: "done" } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error completing task: ", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };


  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "timestamp") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

 
  const filteredTasks = sortedTasks.filter((task) => {
    const matchesCategory = filterCategory
      ? task.category === filterCategory
      : true;
    const matchesMember = filterMember
      ? task.assignedTo === filterMember
      : true;
    return matchesCategory && matchesMember;
  });

  const newTasks = filteredTasks.filter((task) => task.status === "new");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in progress"
  );
  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="home">
      <div className="column">
        <h2>New Tasks</h2>
        {newTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAssign={handleAssign}
            onComplete={() => handleComplete(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
      <div className="column">
        <h2>In Progress</h2>
        {inProgressTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAssign={() => {}} 
            onComplete={() => handleComplete(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
      <div className="column">
        <h2>Done</h2>
        {doneTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAssign={() => {}} 
            onComplete={() => {}} 
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
