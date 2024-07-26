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
          <tr className="font-semibold md:text-lg text-base">
            <th className="md:py-4 py-2 md:w-[85%] w-[70%]">
              Files using Drive Storage
            </th>
            <th
              className="px-2 py-4 cursor-pointer flex gap-2 items-center"
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
              <tr
                key={file.id}
                className="font-medium text-sm md:tracking-wide tracking-normal"
              >
                <td className="md:py-4 md:px-6 px-3 py-3 w-full flex md:gap-5 gap-3">
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
                    ).length > 20
                      ? file.name
                          .substring(
                            file.name.indexOf("/") + 1,
                            file.name.length
                          )
                          .substring(0, 20) + "..."
                      : file.name.substring(
                          file.name.indexOf("/") + 1,
                          file.name.length
                        )}
                  </h3>
                </td>
                <td className="md:p-4 p-2">
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
