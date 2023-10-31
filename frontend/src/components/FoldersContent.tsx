"use client";
import Link from "next/link";
import { FaFolder } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { FolderDataWithID } from "./Folders";
import { deleteDoc, doc } from "firebase/firestore";
import { firestoreDb } from "@/lib/utils/firebaseConfig";
import { deleteNotify } from "./ObjectCards";

interface FoldersContentProps {
  data: Array<FolderDataWithID>;
}

const FoldersContent = ({ data }: FoldersContentProps) => {
  const deleteFolder = async (folderId: string, folderName: string) => {
    let folName = folderName.replace(/\/$/, "");
    const res = await fetch(
      `http://localhost:8000/api/deleteFolder/${folName}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      console.log(await res.text());

      await deleteDoc(doc(firestoreDb, "folders", folderId));
    } else {
      console.log(res.text);
    }

    deleteNotify();
  };

  return (
    <>
      {data.map((folName) => {
        let actualFolderName =
          folName.folderName.split("/").filter(Boolean).pop() ||
          folName.folderName.replace(/\/$/, "");
        return (
          <div
            className="flex gap-6 items-center py-3 px-4 hover:bg-custom-nav bg-custom-nav min-w-fit rounded-xl"
            key={folName.id}
          >
            <Link href={`/folders/${actualFolderName}`}>
              <div className="flex gap-2 items-center">
                <FaFolder />
                <h3>{actualFolderName}</h3>
              </div>
            </Link>
            <div
              onClick={() => deleteFolder(folName.id, folName.folderName)}
              className="rounded-full p-1 hover:bg-custom-backg"
            >
              <SlOptionsVertical />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FoldersContent;
