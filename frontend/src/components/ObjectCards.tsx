"use client";
import Image from "next/image";
import { SlOptionsVertical } from "react-icons/sl";
import { MdSimCardDownload, MdStar, MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  DocumentData,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestoreData } from "./NewItem";
import { firestoreDb } from "@/lib/utils/firebaseConfig";

type ObjectCardsProps = {
  data: QueryDocumentSnapshot<DocumentData, DocumentData>[] | undefined;
};

const downloadObject = async (objKey: string) => {
  let downloadObj = {
    objKey,
  };
  try {
    const res1 = await fetch("http://localhost:8000/api/downloadObject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(downloadObj),
    });
    if (res1.ok) {
      const presigned_get_url = (await res1.json()) as string;
      console.log(presigned_get_url);

      const link = document.createElement("a");
      link.href = presigned_get_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      link.click();
    } else {
      console.log(res1.statusText);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteObject = async (objKey: string, router: AppRouterInstance) => {
  const res = await fetch(`http://localhost:8000/api/deleteObject/${objKey}`, {
    method: "DELETE",
  });
  if (res.ok) {
    console.log(await res.text());
  } else {
    console.log(res.status);
  }

  router.refresh();
};

const starObject = async (objKey: string, docId: string) => {
  await updateDoc(doc(firestoreDb, "objects", docId), {
    isStarred: true,
  });
};

const ObjectCards = ({ data }: ObjectCardsProps) => {
  const router = useRouter();

  return (
    <>
      {data?.map((obj) => {
        let imageSrc;
        let smImageSrc;
        let objectData = obj.data() as firestoreData;

        if (
          objectData.name.endsWith(".png") ||
          objectData.name.endsWith(".jpeg") ||
          objectData.name.endsWith(".jpg") ||
          objectData.name.endsWith(".svg")
        ) {
          imageSrc = "/image-lg.png";
          smImageSrc = "/image-sm.png";
        } else if (objectData.name.endsWith(".pdf")) {
          imageSrc = "/pdf-lg.png";
          smImageSrc = "/pdf-sm.png";
        } else if (
          objectData.name.endsWith(".mp4") ||
          objectData.name.endsWith(".mov") ||
          objectData.name.endsWith(".wmv")
        ) {
          imageSrc = "/mp4-lg.png";
          smImageSrc = "/mp4-sm.png";
        } else if (
          objectData.name.endsWith(".mp3") ||
          objectData.name.endsWith(".wma") ||
          objectData.name.endsWith(".wav")
        ) {
          imageSrc = "/music-lg.png";
          smImageSrc = "/music-sm.png";
        } else {
          imageSrc = "/docs-lg.png";
          smImageSrc = "/docs-sm.png";
        }

        return (
          <div
            key={obj.id}
            className="w-full bg-custom-nav px-3 pt-2 pb-3 rounded-xl h-52 flex flex-col gap-2 group one-edge-box-shadow hover:-translate-y-1 transition-all duration-300 ease-in-out"
            onDoubleClick={() => downloadObject(objectData.name)}
          >
            <div className="flex gap-2 px-2 py-2 items-center justify-between">
              <Image
                src={smImageSrc}
                alt="small-image"
                height={20}
                width={24}
                className="w-5"
              />
              <h3 className="text-[#e6e6e6] text-sm font-medium group-hover:text-blue-400 transition-all duration-300 ease-in-out">
                {objectData.name.substring(
                  objectData.name.indexOf("/") + 1,
                  objectData.name.length
                ).length > 14
                  ? objectData.name
                      .substring(
                        objectData.name.indexOf("/") + 1,
                        objectData.name.length
                      )
                      .substring(0, 14) + "..."
                  : objectData.name.substring(
                      objectData.name.indexOf("/") + 1,
                      objectData.name.length
                    )}
              </h3>
              <div className="dropdown dropdown-end md:translate-x-[14.8px]">
                <div
                  tabIndex={0}
                  className="p-1 rounded-full hover:bg-custom-backg transition-colors duration-300 ease-in-out"
                >
                  <SlOptionsVertical />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-custom-backg border border-custom-nav rounded-box w-[13.5rem] mt-[1.35rem] text-custom-green"
                >
                  <li>
                    <label
                      className="flex gap-6 items-center"
                      onClick={() => downloadObject(objectData.name)}
                    >
                      <MdSimCardDownload size={"1.5em"} />
                      <h5>Download</h5>
                    </label>
                  </li>
                  <li>
                    <label
                      className="flex gap-6 items-center"
                      onClick={() => starObject(objectData.name, obj.id)}
                    >
                      <MdStar size={"1.5em"} />
                      <h5>Star</h5>
                    </label>
                  </li>
                  <li>
                    <label
                      className="flex gap-6 items-center"
                      onClick={() => deleteObject(objectData.name, router)}
                    >
                      <MdDelete size={"1.5em"} />
                      <h5>Delete</h5>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full grid place-content-center flex-grow bg-custom-backg h-20 rounded-xl">
              <Image src={imageSrc} alt="big-image" height={64} width={64} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ObjectCards;
