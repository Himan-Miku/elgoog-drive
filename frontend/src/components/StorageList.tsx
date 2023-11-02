"use client";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { firestoreData } from "./NewItem";
import Image from "next/image";
import bytes from "bytes";
import { FaSortNumericDownAlt, FaSortNumericUpAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { firestoreDataWithoutID } from "./MyDriveContent";
import { ListResultsStore } from "@/context/ListResultsContext";

enum OrderBy {
  Asc = "asc",
  Desc = "desc",
}

const StorageList = () => {
  const { data: session } = useSession();
  const [isDesc, setIsDesc] = useState(true);
  const { listResults, setListResults } = ListResultsStore();

  const username = session?.user?.email?.split("@")[0] || "";

  const q = query(
    collectionRef,
    where("user", "==", username),
    orderBy("size", isDesc ? OrderBy.Desc : OrderBy.Asc)
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

      setListResults(updatedResults);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <table className="w-full text-left text-[#e6e6e6e3]">
        <thead>
          <tr className="font-semibold text-lg">
            <th className="py-4 w-[85%]">Files using Drive Storage</th>
            <th
              className="p-4 cursor-pointer flex gap-2 items-center"
              onClick={() => setIsDesc((prev) => !prev)}
            >
              <h3>Storage Used</h3>
              {isDesc ? <FaSortNumericDownAlt /> : <FaSortNumericUpAlt />}
            </th>
          </tr>
        </thead>
        <tbody>
          {listResults.map((file) => {
            let smImageSrc: string;

            if (file.contentType.startsWith("image")) {
              smImageSrc = "/image-sm.png";
            } else if (file.contentType === "application/pdf") {
              smImageSrc = "/pdf-sm.png";
            } else if (file.contentType.startsWith("video")) {
              smImageSrc = "/mp4-sm.png";
            } else if (file.contentType.startsWith("audio")) {
              smImageSrc = "/music-sm.png";
            } else {
              smImageSrc = "/docs-sm.png";
            }

            return (
              <tr key={file.id} className="font-medium text-sm tracking-wide">
                <td className="py-4 px-6 w-[85%] flex gap-5">
                  <Image
                    src={smImageSrc}
                    alt="small-image"
                    height={20}
                    width={24}
                    className="w-5"
                  />

                  <h3>
                    {file.name.substring(
                      file.name.indexOf("/") + 1,
                      file.name.length
                    ).length > 45
                      ? file.name
                          .substring(
                            file.name.indexOf("/") + 1,
                            file.name.length
                          )
                          .substring(0, 45) + "..."
                      : file.name.substring(
                          file.name.indexOf("/") + 1,
                          file.name.length
                        )}
                  </h3>
                </td>
                <td className="p-4">
                  {bytes.format(file.size, { unitSeparator: " " })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StorageList;
