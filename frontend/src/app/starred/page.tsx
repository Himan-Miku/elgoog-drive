"use client";
import { firestoreData } from "@/components/NewItem";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function StarredPage() {
  const { data: session } = useSession();
  const username = session?.user?.email?.split("@")[0] || "";
  const q = query(
    collectionRef,
    where("isStarred", "==", true),
    where("user", "==", username)
  );
  const [snapshot, loading, error] = useCollection(q);
  snapshot?.docs.forEach((doc) => {
    console.log("Data from Starred Page : ", doc.data());
  });

  return (
    <div>
      {snapshot?.docs.map((doc) => {
        const data = doc.data() as firestoreData;
        return (
          <div key={doc.id}>
            <h3>name:{data.name}</h3>
            <h3>size:{data.size}</h3>
            <h3>contentType:{data.contentType}</h3>
          </div>
        );
      })}
    </div>
  );
}
