// src/services/filterService.ts
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Task } from "../types/task";
import { Member } from "../types/member";

 {Promise<string[]>} 
 
export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const categories = Array.from(
      new Set(querySnapshot.docs.map((doc) => doc.data().category))
    );
    console.log("Fetched categories:", categories); 
    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

 {Promise<Member[]>} 
 
export const getMembers = async (): Promise<Member[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "members"));
    const members = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      role: doc.data().role,
    }));
    console.log("Fetched members:", members); 
    return members;
  } catch (error) {
    console.error("Error fetching members: ", error);
    throw error;
  }
};