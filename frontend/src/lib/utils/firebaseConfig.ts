import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfaVPvy9zCDJ7visTkVjpzjWBcvBvwrzQ",
  authDomain: "elgoog-drive-6917f.firebaseapp.com",
  projectId: "elgoog-drive-6917f",
  storageBucket: "elgoog-drive-6917f.appspot.com",
  messagingSenderId: "155164330496",
  appId: "1:155164330496:web:bf6dda6be87522cbcfa6e5",
};

const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const collectionRef = collection(firestoreDb, "objects");
