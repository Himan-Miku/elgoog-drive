"use client";
import ObjectCards from "@/components/ObjectCards";
import { collectionRef } from "@/lib/utils/firebaseConfig";
import { addDoc, onSnapshot, query, where } from "firebase/firestore";
import { IoCaretForward } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { firestoreData, receivedMetadata } from "@/components/NewItem";
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
    <div className="md:pt-5 md:px-8 pt-3 px-3 flex flex-col gap-3">
      <div className="md:py-2 py-1 flex items-center justify-center w-52 min-w-fit md:text-xl text-lg font-semibold">
        <Link href={"/"}>
          <h5 className="text-custom-green p-2 hover:bg-custom-nav rounded-xl cursor-pointer">
            My Drive /{" "}
          </h5>
        </Link>

        <div className="dropdown dropdown-right">
          <label
            tabIndex={0}
            className="flex text-custom-blue gap-1 items-center justify-center hover:bg-custom-nav p-2 rounded-xl cursor-pointer"
          >
            <h5>{folName}</h5>
            <IoCaretForward />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-1 bg-custom-backg rounded-box md:w-[13.5rem] w-44 md:ml-3 ml-2 text-custom-green shadow-small text-sm"
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
          </ul>
        </div>
      </div>
      {folderNameData.length !== 0 ? (
        <div className="py-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
          <ObjectCards data={folderNameData} forFolders={true} />
        </div>
      ) : (
        <h6 className="font-medium text-gray-500 text-2xl md:px-6 px-3">
          No Files Uploaded in this Folder 📁
        </h6>
      )}
    </div>
  );
};

export default FolderPage;
