"use client";
import { useSession } from "next-auth/react";
import FoldersContent from "./FoldersContent";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestoreDb } from "@/lib/utils/firebaseConfig";
import { FolderData } from "./NewItem";
import { useEffect, useState } from "react";

type FolderID = {
  id: string;
};

export type FolderDataWithID = FolderData & FolderID;

export default function Folders() {
  const [folderData, setFolderData] = useState<Array<FolderDataWithID>>([]);
  const { data: session } = useSession();
  let user_name = session?.user?.email?.split("@")[0] || "";

  const q = query(
    collection(firestoreDb, "folders"),
    where("user", "==", user_name)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let updatedData: Array<FolderDataWithID> = [];

      snapshot.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...(doc.data() as FolderData),
        };

        updatedData.push(data);
      });

      setFolderData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="px-11 py-2 font-semibold text-[#e6e6e6]">Folders</div>
      <div className="flex gap-6 px-8 py-3">
        <FoldersContent data={folderData} />
      </div>
    </>
  );
}
