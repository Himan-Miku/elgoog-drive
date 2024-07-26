"use client";
import Link from "next/link";
import { FaFolder } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { FolderDataWithID } from "./Folders";
import {
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { collectionRef, firestoreDb } from "@/lib/utils/firebaseConfig";
import { FolderDeleteToast, deleteNotify } from "./ObjectCards";
import { firestoreDataWithoutID } from "./MyDriveContent";

interface FoldersContentProps {
  data: Array<FolderDataWithID>;
}

const FoldersContent = ({ data }: FoldersContentProps) => {
  const delete_docs_firestore = async (fName: string) => {
    let documentIDs: Array<string> = [];
    const username = data[0].user || "";

    const q = query(collectionRef, where("user", "==", username));

    const objectsData = await getDocs(q);

    objectsData.forEach((doc) => {
      const objectdata = {
        id: doc.id,
        ...(doc.data() as firestoreDataWithoutID),
      };
      if (objectdata.name.startsWith(fName)) {
        console.log("Folders starting with fName: ", objectdata.name);

        documentIDs.push(objectdata.id);
      }
    });

    console.log("Document ID Vec : ", documentIDs);

    const batch = writeBatch(firestoreDb);

    documentIDs.forEach((docId) => {
      const docRef = doc(firestoreDb, "objects", docId);
      batch.delete(docRef);
    });

    await batch
      .commit()
      .then(() => {
        console.log("Documents successfully deleted.");
      })
      .catch((error) => {
        console.error("Error deleting documents: ", error);
      });
  };

  const deleteFolder = async (folderId: string, folderName: string) => {
    let folName = folderName.replace(/\/$/, "");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteFolder/${folName}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      console.log(await res.text());
      await delete_docs_firestore(folderName);
      await deleteDoc(doc(firestoreDb, "folders", folderId));

      FolderDeleteToast();
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
            className="flex md:gap-6 gap-3 items-center md:py-3 py-2 md:pl-4 md:pr-3 pl-3 pr-2 hover:bg-custom-nav bg-custom-nav min-w-fit rounded-xl"
            key={folName.id}
          >
            <Link href={`/folders/${actualFolderName}`}>
              <div className="flex gap-2 items-center md:text-base text-sm">
                <FaFolder />
                <h3>{actualFolderName}</h3>
              </div>
            </Link>
            <div className="dropdown dropdown-top dropdown-end">
              <label tabIndex={0}>
                <div className="rounded-full p-1 hover:bg-custom-backg">
                  <SlOptionsVertical />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu shadow bg-custom-backg rounded-box font-semibold md:mb-4 mb-2 translate-x-4"
              >
                <li className="border border-custom-green border-opacity-30 rounded-lg">
                  <button
                    onClick={() => deleteFolder(folName.id, folName.folderName)}
                    className="text-custom-green"
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FoldersContent;
