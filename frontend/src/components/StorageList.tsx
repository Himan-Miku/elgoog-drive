"use client";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestoreData } from "./NewItem";
import Image from "next/image";
import bytes from "bytes";

const StorageList = () => {
  const { data: session } = useSession();

  const username = session?.user?.email?.split("@")[0] || "";

  const q = query(collectionRef, where("user", "==", username));

  const [snapshot, loading, error] = useCollection(q);

  return (
    <div>
      <table className="w-full text-left text-[#e6e6e6e3]">
        <thead>
          <tr className="font-semibold text-lg">
            <th className="py-4 w-[85%]">Files using Drive Storage</th>
            <th className="p-4">Storage Used</th>
          </tr>
        </thead>
        <tbody>
          {snapshot?.docs.map((file) => {
            let smImageSrc: string;
            const fileData = file.data() as firestoreData;

            if (
              fileData.name.endsWith(".png") ||
              fileData.name.endsWith(".jpeg") ||
              fileData.name.endsWith(".jpg") ||
              fileData.name.endsWith(".svg")
            ) {
              smImageSrc = "/image-sm.png";
            } else if (fileData.name.endsWith(".pdf")) {
              smImageSrc = "/pdf-sm.png";
            } else if (
              fileData.name.endsWith(".mp4") ||
              fileData.name.endsWith(".mov") ||
              fileData.name.endsWith(".wmv")
            ) {
              smImageSrc = "/mp4-sm.png";
            } else if (
              fileData.name.endsWith(".mp3") ||
              fileData.name.endsWith(".wma") ||
              fileData.name.endsWith(".wav")
            ) {
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
