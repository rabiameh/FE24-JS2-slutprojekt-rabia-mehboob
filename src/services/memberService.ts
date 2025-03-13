
import { db } from "./firebase";
import { collection, addDoc,getDocs } from "firebase/firestore";

export const addMember = async (member: { name: string; role: string }) => {
  try {
    await addDoc(collection(db, "members"), member);
    console.log("Member added successfully!");
  } catch (error) {
    console.error("Error adding member: ", error);
  }
};



export interface Member {
  id: string;
  name: string;
  role: string;
}

export const getMembers = async (): Promise<Member[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "members"));
    console.log("Firestore querySnapshot (members):", querySnapshot); 
    const members = querySnapshot.docs.map((doc) => {
      console.log("Firestore document data (members):", doc.data()); 
      return {
        id: doc.id,
        name: doc.data().name,
        role: doc.data().role,
      };
    });
    console.log("Fetched members:", members); 
    return members;
  } catch (error) {
    console.error("Error fetching members: ", error);
    throw error;
  }
};