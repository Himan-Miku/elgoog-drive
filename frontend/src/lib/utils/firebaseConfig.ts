import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaJspgr20esUo9-kR9M3QnPEhh0NrTGNk",
  authDomain: "elgoog-drive-88b3d.firebaseapp.com",
  projectId: "elgoog-drive-88b3d",
  storageBucket: "elgoog-drive-88b3d.appspot.com",
  messagingSenderId: "1023892633662",
  appId: "1:1023892633662:web:d7b7fac355fb526d0a396f",
};

const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app);
export const collectionRef = collection(firestoreDb, "objects");
