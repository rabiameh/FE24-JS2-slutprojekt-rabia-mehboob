
import { db } from "./firebase";
import { collection, addDoc, getDocs,Timestamp, deleteDoc } from "firebase/firestore";
import { Task } from "../types/task"; 

import { doc, updateDoc } from "firebase/firestore";
// Function to add a task
export const addTask = async (task: Omit<Task, "id">) => {
  try {
    await addDoc(collection(db, "tasks"), task);
    console.log("Task added successfully!");
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error; 
  }
};




export const getTasks = async (): Promise<Task[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    console.log("Firestore querySnapshot:", querySnapshot); 
    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Firestore document data:", data);

      
      let timestamp: Date;
      if (data.timestamp instanceof Timestamp) {
       
        timestamp = data.timestamp.toDate();
      } else if (typeof data.timestamp === "string") {
       
        timestamp = new Date(data.timestamp);
      } else {
        
        console.warn("Invalid timestamp format. Using current date as fallback.");
        timestamp = new Date();
      }

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        timestamp: timestamp, 
        assignedTo: data.assignedTo || null,
      };
    });
    console.log("Fetched tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    throw error;
  }
};


export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "tasks", taskId), updates);
    console.log("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
};



export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "tasks", taskId)); 
    console.log("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};