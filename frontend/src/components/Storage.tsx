"use client";

import { collectionRef } from "@/lib/utils/firebaseConfig";
import bytes from "bytes";
import { query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestoreData } from "./NewItem";

const Storage = () => {
  const { data: session } = useSession();

  const username = session?.user?.email?.split("@")[0] || "";

  const q = query(collectionRef, where("user", "==", username));

  const [snapshot, loading, error] = useCollection(q);

  const totalSize = snapshot?.docs.reduce((acc, currfile) => {
    return acc + (currfile.data().size || 0);
  }, 0);

  const contentType = {
    image: 0,
    video: 0,
    audio: 0,
    other: 0,
  };

  snapshot?.docs.forEach((file) => {
    const fileData = file.data() as firestoreData;

    if (fileData.contentType.startsWith("image")) {
      contentType.image += fileData.size || 0;
    } else if (fileData.contentType.startsWith("video")) {
      contentType.video += fileData.size || 0;
    } else if (fileData.contentType.startsWith("audio")) {
      contentType.audio += fileData.size || 0;
    } else {
      contentType.other += fileData.size || 0;
    }
  });

  const percentage = {
    image: Math.round((contentType.image / totalSize!) * 100),
    video: Math.round((contentType.video / totalSize!) * 100),
    audio: Math.round((contentType.audio / totalSize!) * 100),
    other: Math.round((contentType.other / totalSize!) * 100),
  };

  console.log("percentages : ", percentage);

  return (
    <div className="flex flex-col md:gap-6 gap-4">
      <div className="text-custom-green md:text-xl text-lg font-semibold tracking-wide">
        <h3>Storage Uploaded</h3>
      </div>
      <div className="flex flex-col md:gap-4 gap-3">
        <div>
          <h3>
            <span className="md:text-2xl text-xl text-[#e6e6e6e3] font-semibold">
              {bytes.format(totalSize!, { unitSeparator: " " })}
            </span>{" "}
            used
          </h3>
        </div>
        <div className="flex md:h-2 h-1 rounded-2xl w-full">
          <div
            className={`h-full rounded-2xl bg-[#4285F4]`}
            style={{ width: `${percentage.image}%` }}
          ></div>
          <div
            className={`h-full rounded-2xl bg-[#FBBC04]`}
            style={{ width: `${percentage.video}%` }}
          ></div>
          <div
            className={`h-full rounded-2xl bg-[#EA4335]`}
            style={{ width: `${percentage.audio}%` }}
          ></div>
          <div
            className={`h-full rounded-2xl bg-custom-green`}
            style={{ width: `${percentage.other}%` }}
          ></div>
        </div>
        <div className="flex gap-6 md:text-sm text-xs">
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-[#4285F4] h-2 w-2"></div>
            <h5>Images</h5>
          </div>
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-[#FBBC04] h-2 w-2"></div>
            <h5>Videos</h5>
          </div>
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-[#EA4335] h-2 w-2"></div>
            <h5>Audios</h5>
          </div>
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-custom-green h-2 w-2"></div>
            <h5>Other Documents</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
