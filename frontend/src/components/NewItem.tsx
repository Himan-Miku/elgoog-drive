"use client";

import { FolderNameStore } from "@/context/FolderNameContext";
import { useSession } from "next-auth/react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  MdOutlineUploadFile,
  MdOutlineDriveFolderUpload,
} from "react-icons/md";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { collectionRef, firestoreDb } from "@/lib/utils/firebaseConfig";
import { usePathname } from "next/navigation";

export type receivedMetadata = {
  obj_key: string;
  presigned_put_uri: string;
  user_name: string;
  sent_from: string;
};

export type FolderData = {
  folderName: string;
  user: string;
};

export interface firestoreData {
  id: string;
  name: string;
  user: string;
  contentType: string;
  size: number;
  isStarred: boolean;
}

const NewItem = () => {
  const { folName, setFolName } = FolderNameStore();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <label
          tabIndex={0}
          className="flex gap-3 min-w-fit w-1/2 items-center justify-center min-h-fit h-14 px-2 border-[0.25px] border-gray-500 rounded-xl text-[#e6e6e6] bg-custom-backg bg-opacity-50 hover:bg-opacity-70 hover:-translate-y-[0.175rem] transition-all duration-200 hover:shadow-sm hover:shadow-[#e6e6e6] cursor-pointer"
        >
          <AiOutlinePlus size={"1.5em"} />
          <h5 className="mr-[0.25rem]">New</h5>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-custom-backg rounded-box w-[13.5rem] mt-[1.3rem] text-custom-green"
        >
          <li>
            <label className="flex gap-6 items-center">
              <input
                type="file"
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    console.log(e.target.files[0]);

                    let file = e.target.files[0];

                    const metadata = {
                      name: file.name,
                      contentType: file.type,
                      size: file.size,
                      user: session?.user?.email,
                      sentFrom: pathname,
                    };

                    try {
                      const response = await fetch(
                        "http://localhost:8000/api/getMetadata",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(metadata),
                        }
                      );

                      if (response.ok) {
                        console.log("Metadata sent successfully");
                        const uri_data: receivedMetadata =
                          await response.json();
                        console.log("uri_data from NewItem: ", uri_data);
                        try {
                          const response = await fetch(
                            uri_data.presigned_put_uri,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": metadata.contentType,
                              },
                              body: e.target.files[0],
                            }
                          );

                          if (response.ok) {
                            console.log("File uploaded successfully!");
                            await addDoc(collectionRef, {
                              name: uri_data.obj_key,
                              user: uri_data.user_name,
                              size: file.size,
                              contentType: file.type,
                              isStarred: false,
                              sentFrom: uri_data.sent_from,
                            });
                          } else {
                            console.log("Error uploading file.");
                          }
                        } catch (error) {
                          console.error("An error occurred:", error);
                        }
                      } else {
                        console.log(
                          `Metadata response error ${response.status}`
                        );
                      }
                    } catch (error) {
                      console.log("An error occured while sending metadata");
                    }
                  }
                }}
                className="w-full"
              />
              <MdOutlineUploadFile size={"1.5em"} />
              <h5>File Upload</h5>
            </label>
          </li>
          <li>
            <label
              className="flex gap-6 items-center"
              onClick={() => {
                const modal = document.getElementById("my_modal_5");
                if (modal instanceof HTMLDialogElement) {
                  modal.showModal();
                }
              }}
            >
              <MdOutlineDriveFolderUpload size={"1.5em"} />
              <h5>Create Folder</h5>
            </label>
          </li>
        </ul>
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-4 bg-custom-nav">
          <h3 className="font-semibold text-lg px-1">New Folder</h3>
          <div>
            <form className="flex flex-col gap-4 items-start">
              <input
                type="text"
                value={folName}
                onChange={(e) => {
                  setFolName(e.target.value);
                }}
                className="placeholder:text-custom-green placeholder:font-light text-custom-green rounded-xl focus:outline-none p-3 bg-custom-backg font-semibold"
                placeholder="Folder Name"
              />
              <div className="flex gap-6">
                <button
                  className="bg-custom-blue py-2 px-3 text-sm font-semibold rounded-lg text-[#e6e6e6]"
                  onClick={async (e) => {
                    e.preventDefault();
                    console.log(folName);

                    const folderData: FolderData = {
                      folderName: folName,
                      user: session?.user?.email!,
                    };

                    try {
                      const response = await fetch(
                        "http://localhost:8000/api/createFolder",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(folderData),
                        }
                      );

                      if (response.ok) {
                        const res = (await response.json()) as FolderData;
                        console.log(res);

                        await addDoc(collection(firestoreDb, "folders"), {
                          folderName: res.folderName,
                          user: res.user,
                          createdAt: serverTimestamp(),
                        });
                      } else {
                        console.log(response.status);
                      }
                    } catch (error) {
                      console.log(error);
                    }

                    const modal = document.getElementById("my_modal_5");
                    if (modal instanceof HTMLDialogElement) {
                      modal.close();
                    }
                    setFolName("");
                  }}
                >
                  Create
                </button>
                <button
                  formMethod="dialog"
                  className="py-2 px-3 text-sm font-semibold rounded-lg border-gray-600 shadow-sm shadow-[#e6e6e6] border-[0.5px]"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewItem;
