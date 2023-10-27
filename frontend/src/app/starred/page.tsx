"use client";
import ObjectCards from "@/components/ObjectCards";
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
    <div className="px-8 py-7 flex flex-col gap-6">
      <div className="text-custom-green text-xl font-semibold px-1 tracking-wide">
        Starred Files
      </div>
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
        <ObjectCards data={snapshot?.docs} />
      </div>
    </div>
  );
}
