"use client";
import { firestoreDataWithoutID } from "@/components/MyDriveContent";
import { firestoreData } from "@/components/NewItem";
import ObjectCards from "@/components/ObjectCards";
import { ResultsStore } from "@/context/MyDriveDataContext";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function StarredPage() {
  const { data: session } = useSession();
  const { results, setResults } = ResultsStore();
  const username = session?.user?.email?.split("@")[0] || "";
  const q = query(
    collectionRef,
    where("isStarred", "==", true),
    where("user", "==", username)
  );
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
    <div className="px-8 py-7 flex flex-col gap-6">
      <div className="text-custom-green text-xl font-semibold px-1 tracking-wide">
        Starred Files
      </div>
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
        <ObjectCards data={results} />
      </div>
    </div>
  );
}
