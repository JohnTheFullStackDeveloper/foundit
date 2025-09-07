import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, remove } from "firebase/database";
import { ref, set, get, child } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyAVaxmK6mYeLC1U7gxK1QzmsWaN_hjo9K8",
  authDomain: "instagram2-fc9b3.firebaseapp.com",
  databaseURL: "https://instagram2-fc9b3-default-rtdb.firebaseio.com",
  projectId: "instagram2-fc9b3",
  storageBucket: "instagram2-fc9b3.firebasestorage.app",
  messagingSenderId: "742327630454",
  appId: "1:742327630454:web:c745d6941368c21365fd57",
  measurementId: "G-LZXFE4022W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export const setDataFG = async (path, value) => {
  try {
    await set(ref(db, path), value);
  } catch (error) {
    console.error(`Error setting data at ${path}:`, error);
    throw error;
  }
};
export const getDataFG = async (path) => {
  console.log("getting"+path)
  try {
    const snapshot = await get(child(ref(db), path));
    if (snapshot.exists()) {
        return snapshot;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    throw error;
  }
};
export const removeDataFG = async (path) => {
  try {
    await remove(ref(db, path));
    console.log("Data removed successfully")
    return true;
  } catch (error) {
    console.error(`Error removing data at ${path}:`, error);
    throw error;
  }
}