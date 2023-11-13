"use client";
import Image from "next/image";
import { SlOptionsVertical } from "react-icons/sl";
import { MdSimCardDownload, MdStar, MdDelete } from "react-icons/md";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestoreData } from "./NewItem";
import { firestoreDb } from "@/lib/utils/firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

type ObjectCardsProps = {
  data: Array<firestoreData>;
  forFolders?: boolean;
};

const starNotify = () =>
  toast("File Starred", {
    icon: "⭐",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

export const deleteNotify = () =>
  toast("File Deleted", {
    icon: "🗑️",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

const unstarNotify = () =>
  toast("File Removed from Starred", {
    icon: "💫",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

export const FolderCreateToast = () =>
  toast("Folder Created", {
    icon: "📂",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

export const FolderDeleteToast = () =>
  toast("Folder Deleted", {
    icon: "📂",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

export const FileUpload = () =>
  toast("File Uploaded", {
    icon: "📂",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#3F4BD1",
      color: "#fff",
    },
  });

const shareLinkToast = (url: string) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-custom-backg border border-gray-600 rounded-xl`}
    >
      <div className="flex justify-between items-center gap-4 py-2 px-3">
        <div className="flex items-start flex-col justify-center gap-2 p-1">
          <p className="text-base font-semibold text-gray-400">
            Shareable Link 🌐:
          </p>
          <p className="text-sm font-semibold text-custom-green">{url}</p>
        </div>
        <div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
            className="btn-sm rounded-md bg-custom-nav hover:bg-custom-green hover:text-custom-backg font-semibold"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  ));
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

const shareObject = async (objKey: string) => {
  let shareObj = {
    objKey,
  };
  let shortenerBaseUrl = "https://url-shortener-service.p.rapidapi.com/shorten";

  try {
    const res1 = await fetch("http://localhost:8000/api/shareObject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shareObj),
    });
    if (res1.ok) {
      const presigned_get_url = (await res1.json()) as string;

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_URL_SHORTNER_KEY!,
          "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
        },
        body: new URLSearchParams({
          url: `${presigned_get_url}`,
        }),
      };

      const response = await fetch(shortenerBaseUrl, options);
      const shortenUrl = await response.json();

      shareLinkToast(shortenUrl.result_url);
    } else {
      console.log(res1.statusText);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteObject = async (objKey: string, docId: string) => {
  const res = await fetch(`http://localhost:8000/api/deleteObject/${objKey}`, {
    method: "DELETE",
  });
  if (res.ok) {
    console.log(await res.text());

    await deleteDoc(doc(firestoreDb, "objects", docId));
  } else {
    console.log(res.status);
  }

  deleteNotify();
};

const starObject = async (docId: string) => {
  await updateDoc(doc(firestoreDb, "objects", docId), {
    isStarred: true,
  });
  starNotify();
};

const UnstarObject = async (docId: string) => {
  await updateDoc(doc(firestoreDb, "objects", docId), {
    isStarred: false,
  });
  unstarNotify();
};

const ObjectCards = ({ data, forFolders }: ObjectCardsProps) => {
  const pathname = usePathname();

  return (
    <>
      {data?.map((obj) => {
        let imageSrc;
        let smImageSrc;

        if (obj.contentType.startsWith("image")) {
          imageSrc = "/image-lg.png";
          smImageSrc = "/image-sm.png";
        } else if (obj.contentType === "application/pdf") {
          imageSrc = "/pdf-lg.png";
          smImageSrc = "/pdf-sm.png";
        } else if (obj.contentType.startsWith("video")) {
          imageSrc = "/mp4-lg.png";
          smImageSrc = "/mp4-sm.png";
        } else if (obj.contentType.startsWith("audio")) {
          imageSrc = "/music-lg.png";
          smImageSrc = "/music-sm.png";
        } else {
          imageSrc = "/docs-lg.png";
          smImageSrc = "/docs-sm.png";
        }

        return (
          <div key={obj.id}>
            <Toaster position="bottom-left" reverseOrder={false} />
            <div
              className="w-full bg-custom-nav px-3 pt-2 pb-3 rounded-xl h-52 flex flex-col gap-2 group one-edge-box-shadow hover:-translate-y-1 transition-all duration-300 ease-in-out"
              onDoubleClick={() => downloadObject(obj.name)}
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
                  {forFolders
                    ? obj.name.substring(
                        obj.name.indexOf("/", obj.name.indexOf("/") + 1) + 1
                      ).length > 13
                      ? obj.name
                          .substring(
                            obj.name.indexOf("/", obj.name.indexOf("/") + 1) + 1
                          )
                          .substring(0, 13) + "..."
                      : obj.name.substring(
                          obj.name.indexOf("/", obj.name.indexOf("/") + 1) + 1
                        )
                    : obj.name.substring(
                        obj.name.indexOf("/") + 1,
                        obj.name.length
                      ).length > 13
                    ? obj.name
                        .substring(obj.name.indexOf("/") + 1, obj.name.length)
                        .substring(0, 13) + "..."
                    : obj.name.substring(
                        obj.name.indexOf("/") + 1,
                        obj.name.length
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
                    className="dropdown-content z-[1] menu p-2 shadow bg-custom-backg border border-custom-nav rounded-box w-[13.5rem] mt-2 text-custom-green"
                  >
                    <li>
                      <label
                        className="flex gap-6 items-center"
                        onClick={() => downloadObject(obj.name)}
                      >
                        <MdSimCardDownload size={"1.5em"} />
                        <h5>Download</h5>
                      </label>
                    </li>
                    <li>
                      {pathname === "/starred" ? (
                        <label
                          className="flex gap-6 items-center"
                          onClick={() => UnstarObject(obj.id)}
                        >
                          <MdStar size={"1.5em"} />
                          <h5>Unstar</h5>
                        </label>
                      ) : (
                        <label
                          className="flex gap-6 items-center"
                          onClick={() => starObject(obj.id)}
                        >
                          <MdStar size={"1.5em"} />
                          <h5>Star</h5>
                        </label>
                      )}
                    </li>
                    <li>
                      <label
                        className="flex gap-6 items-center"
                        onClick={() => shareObject(obj.name)}
                      >
                        <MdSimCardDownload size={"1.5em"} />
                        <h5>Share</h5>
                      </label>
                    </li>
                    <li>
                      <label
                        className="flex gap-6 items-center"
                        onClick={() => deleteObject(obj.name, obj.id)}
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
          </div>
        );
      })}
    </>
  );
};

export default ObjectCards;
