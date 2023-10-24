"use client";
import ObjectCards from "./ObjectCards";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { useSession } from "next-auth/react";

const MyDriveContent = () => {
  const { data: session } = useSession();
  let username = session?.user?.email?.split("@")[0];

  const [snapshot, loading, error] = useCollection(collectionRef);

  console.log("Data from MyDriveContent : ", snapshot?.docs);
  snapshot?.docs.forEach((obj) => {
    console.log(obj.data());
  });

  return (
    <div className="px-8 py-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
      <ObjectCards data={snapshot?.docs} />
    </div>
  );
};

export default MyDriveContent;
