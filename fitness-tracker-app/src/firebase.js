import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

let app = null;
let auth = null;
let googleProvider = null;
let isFirebaseConfigured = false;
let missingFirebaseKeys = [];

try {
  const requiredKeys = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.appId,
  ];
  isFirebaseConfigured = requiredKeys.every(Boolean);
  missingFirebaseKeys = [
    !firebaseConfig.apiKey && "VITE_FIREBASE_API_KEY",
    !firebaseConfig.authDomain && "VITE_FIREBASE_AUTH_DOMAIN",
    !firebaseConfig.projectId && "VITE_FIREBASE_PROJECT_ID",
    !firebaseConfig.appId && "VITE_FIREBASE_APP_ID",
  ].filter(Boolean);
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn(
      "Firebase not configured: missing env values ->",
      missingFirebaseKeys
    );
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

export { auth, googleProvider, isFirebaseConfigured, missingFirebaseKeys };
