import { initializeApp, } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { getDatabase, connectDatabaseEmulator } from "firebase/database"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const fireBaseApp = initializeApp(firebaseConfig);

export const firebase = {
  auth: getAuth(fireBaseApp),
  storage: getStorage(fireBaseApp),
  firestore: getFirestore(fireBaseApp),
  functions: getFunctions(fireBaseApp),
  database: getDatabase(fireBaseApp)
}

if (import.meta.env.MODE === "development" || process.env.NODE_ENV === "test") {
  connectAuthEmulator(firebase.auth,
    `http://${import.meta.env.VITE_HOTSPOT_HOST || "127.0.0.1"}:9099`,
    { disableWarnings: true }
  )
  connectStorageEmulator(
    firebase.storage,
    import.meta.env.VITE_HOTSPOT_HOST || "127.0.0.1", 9199
  )
  connectFirestoreEmulator(
    firebase.firestore,
    import.meta.env.VITE_HOTSPOT_HOST || "127.0.0.1", 8080
  )
  connectFunctionsEmulator(
    firebase.functions,
    import.meta.env.VITE_HOTSPOT_HOST || "127.0.0.1", 5001
  )
  connectDatabaseEmulator(
    firebase.database,
    import.meta.env.VITE_HOTSPOT_HOST || "127.0.0.1", 9000
  )
}
