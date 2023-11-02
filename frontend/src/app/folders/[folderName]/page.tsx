"use client";
import ObjectCards from "@/components/ObjectCards";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { onSnapshot, query, where } from "firebase/firestore";
import { IoCaretForward } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { firestoreData } from "@/components/NewItem";
import { firestoreDataWithoutID } from "@/components/MyDriveContent";
import { usePathname } from "next/navigation";
import Link from "next/link";

const FolderPage = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [folderNameData, setFolderNameData] = useState<Array<firestoreData>>(
    []
  );
  const username = session?.user?.email?.split("@")[0] || "";
  const q = query(
    collectionRef,
    where("user", "==", username),
    where("sentFrom", "==", pathname)
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

      setFolderNameData(updatedResults);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  let folName = pathname.split("/").filter(Boolean).pop()?.replace(/%20/g, " ");

  return (
    <div className="pt-5 px-8 flex flex-col gap-3">
      <div className="p-2 flex items-center justify-center w-52 min-w-fit text-xl font-semibold">
        <Link href={"/"}>
          <h5 className="text-custom-green p-2 hover:bg-custom-nav rounded-xl cursor-pointer">
            My Drive /{" "}
          </h5>
        </Link>
        <div className="flex text-custom-blue gap-1 items-center justify-center hover:bg-custom-nav p-2 rounded-xl cursor-pointer">
          <h5>{folName}</h5>
          <IoCaretForward />
        </div>
      </div>
      <div className="py-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
        <ObjectCards data={folderNameData} forFolders={true} />
      </div>
    </div>
  );
};

export default FolderPage;
