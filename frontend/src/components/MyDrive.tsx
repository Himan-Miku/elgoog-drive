"use client";
import "../scss/HomePage.scss";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { addDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { IoCaretForward } from "react-icons/io5";
import {
  MdOutlineUploadFile,
  MdOutlineDriveFolderUpload,
} from "react-icons/md";
import { receivedMetadata } from "./NewItem";
import { FolderNameStore } from "@/context/FolderNameContext";
import { usePathname } from "next/navigation";
import { ResultsStore } from "@/context/MyDriveDataContext";
import { FileUpload } from "./ObjectCards";

const MyDrive = () => {
  const { data: session } = useSession();
  const { folName, setFolName } = FolderNameStore();
  const { results } = ResultsStore();
  const pathname = usePathname();

  return (
    <div className="md:pt-5 md:px-8 pt-3 px-3">
      <div className="dropdown dropdown-right">
        <label
          tabIndex={0}
          className="text-custom-green min-w-fit w-32 py-2 rounded-xl hover:bg-custom-nav flex gap-2 items-center justify-center"
        >
          <h5 className="md:text-xl text-lg font-semibold">My Drive</h5>
          <IoCaretForward />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-1 bg-custom-backg rounded-box md:w-[13.5rem] w-44 md:ml-3 ml-2 -translate-y-[0.6rem] text-custom-green shadow-small text-sm"
        >
          <li>
            <label className="flex md:gap-6 gap-3 items-center">
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
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getMetadata`,
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
                            console.log(response);
                            await addDoc(collectionRef, {
                              name: uri_data.obj_key,
                              user: uri_data.user_name,
                              size: file.size,
                              contentType: file.type,
                              isStarred: false,
                              sentFrom: uri_data.sent_from,
                            });

                            FileUpload();
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
              <MdOutlineUploadFile size={"1.2em"} />
              <h5>File Upload</h5>
            </label>
          </li>
          <li>
            <label
              className="flex md:gap-6 gap-3 items-center"
              onClick={() => {
                const modal = document.getElementById("my_modal_5");
                if (modal instanceof HTMLDialogElement) {
                  modal.showModal();
                }
              }}
            >
              <MdOutlineDriveFolderUpload size={"1.2em"} />
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

                    const folderData = {
                      folderName: folName,
                    };

                    try {
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createFolder`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(folderData),
                        }
                      );

                      if (response.ok) {
                        const res = await response.text();
                        console.log(res);
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
      <div className="min-w-fit w-32 md:py-3 pt-1 pb-2 md:px-[0.6rem] px-3">
        {results.length != 0 ? (
          <h6 className="text-sm font-medium text-gray-500">Suggested</h6>
        ) : (
          <h6 className="font-medium text-gray-500 text-2xl">
            No Files Uploaded in My Drive 🗃️
          </h6>
        )}
      </div>
    </div>
  );
};

export default MyDrive;
