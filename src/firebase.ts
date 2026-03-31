import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This file will be updated once set_up_firebase is complete
// For now, we use a placeholder structure
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

// Attempt to load real config if it exists
let config = firebaseConfig;
try {
  // @ts-ignore
  import realConfig from "./firebase-applet-config.json";
  config = realConfig;
} catch (e) {
  console.warn("Firebase config not found, using placeholders");
}

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
