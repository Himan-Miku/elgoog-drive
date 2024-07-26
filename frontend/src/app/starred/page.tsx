"use client";
import { firestoreDataWithoutID } from "@/components/MyDriveContent";
import { firestoreData } from "@/components/NewItem";
import ObjectCards from "@/components/ObjectCards";
import { StarredResultsStore } from "@/context/StarredResultsContext";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function StarredPage() {
  const { data: session } = useSession();
  const { setStarredResults, starredResults } = StarredResultsStore();
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

      setStarredResults(updatedResults);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="md:px-8 px-3 md:py-7 py-5 flex flex-col gap-6">
      <div className="text-custom-green md:text-xl text-lg font-semibold px-1 tracking-wide">
        Starred Files
      </div>

      {starredResults.length != 0 ? (
        <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
          <ObjectCards data={starredResults} />
        </div>
      ) : (
        <h6 className="font-medium text-gray-500 text-2xl px-1">
          No Files Starred 💫
        </h6>
      )}
    </div>
  );
}
