"use client";
import ObjectCards from "./ObjectCards";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { useSession } from "next-auth/react";
import { onSnapshot, query, where } from "firebase/firestore";
import { ResultsStore } from "@/context/MyDriveDataContext";
import { firestoreData } from "./NewItem";
import { useEffect } from "react";

interface firestoreDataWithoutID {
  name: string;
  user: string;
  contentType: string;
  size: number;
  isStarred: boolean;
}

const MyDriveContent = () => {
  const { results, setResults } = ResultsStore();
  const { data: session } = useSession();
  let username = session?.user?.email?.split("@")[0] || "";

  const q = query(collectionRef, where("user", "==", username));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let updatedResults: Array<firestoreData> = [];

      snapshot.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...(doc.data() as firestoreDataWithoutID),
        };

        updatedResults.push(data);
      });

      setResults(updatedResults);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="px-8 py-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
      <ObjectCards data={results} />
    </div>
  );
};

export default MyDriveContent;
