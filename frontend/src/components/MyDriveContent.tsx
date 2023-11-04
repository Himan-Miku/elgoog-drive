"use client";
import ObjectCards from "./ObjectCards";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { useSession } from "next-auth/react";
import { onSnapshot, query, where } from "firebase/firestore";
import { ResultsStore } from "@/context/MyDriveDataContext";
import { firestoreData } from "./NewItem";
import { useEffect } from "react";
import { AlgoliaStore } from "@/context/AlgoliaContext";

export interface firestoreDataWithoutID {
  name: string;
  user: string;
  contentType: string;
  size: number;
  isStarred: boolean;
}

const MyDriveContent = () => {
  let renderingResults;
  const { results, setResults } = ResultsStore();
  const { queryy, searchResults } = AlgoliaStore();
  const { data: session } = useSession();
  let username = session?.user?.email?.split("@")[0] || "";
  let sentFromArray = ["/", "/starred", "/storage"];

  const q = query(
    collectionRef,
    where("user", "==", username),
    where("sentFrom", "in", sentFromArray)
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

  if (queryy === "") {
    renderingResults = results;
  } else {
    renderingResults = searchResults;
  }

  return (
    <div className="px-8 py-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
      <ObjectCards data={renderingResults} />
    </div>
  );
};

export default MyDriveContent;
