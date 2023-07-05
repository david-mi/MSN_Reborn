import { initializeApp, } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const fireBaseApp = initializeApp(firebaseConfig);

export const firebase = {
  auth: getAuth(fireBaseApp),
  storage: getStorage(fireBaseApp),
  firestore: getFirestore(fireBaseApp)
}

if (import.meta.env.MODE === "development" || process.env.NODE_ENV === "test") {
  connectAuthEmulator(firebase.auth, "http://127.0.0.1:9099")
  connectStorageEmulator(firebase.storage, "127.0.0.1", 9199)
  connectFirestoreEmulator(firebase.firestore, "127.0.0.1", 8080)
}
