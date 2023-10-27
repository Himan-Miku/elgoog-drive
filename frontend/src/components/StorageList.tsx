"use client";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestoreData } from "./NewItem";
import Image from "next/image";
import bytes from "bytes";
import { FaSortNumericDownAlt, FaSortNumericUpAlt } from "react-icons/fa";
import { useState } from "react";

enum OrderBy {
  Asc = "asc",
  Desc = "desc",
}

const StorageList = () => {
  const { data: session } = useSession();
  const [isDesc, setIsDesc] = useState(true);

  const username = session?.user?.email?.split("@")[0] || "";

  const q = query(
    collectionRef,
    where("user", "==", username),
    orderBy("size", isDesc ? OrderBy.Desc : OrderBy.Asc)
  );

  const [snapshot, loading, error] = useCollection(q);

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
          {snapshot?.docs.map((file) => {
            let smImageSrc: string;
            const fileData = file.data() as firestoreData;

            if (fileData.contentType.startsWith("image")) {
              smImageSrc = "/image-sm.png";
            } else if (fileData.contentType === "application/pdf") {
              smImageSrc = "/pdf-sm.png";
            } else if (fileData.contentType.startsWith("video")) {
              smImageSrc = "/mp4-sm.png";
            } else if (fileData.contentType.startsWith("audio")) {
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
                    {fileData.name.substring(
                      fileData.name.indexOf("/") + 1,
                      fileData.name.length
                    ).length > 45
                      ? fileData.name
                          .substring(
                            fileData.name.indexOf("/") + 1,
                            fileData.name.length
                          )
                          .substring(0, 45) + "..."
                      : fileData.name.substring(
                          fileData.name.indexOf("/") + 1,
                          fileData.name.length
                        )}
                  </h3>
                </td>
                <td className="p-4">
                  {bytes.format(fileData.size, { unitSeparator: " " })}
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
