"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineUploadFile } from "react-icons/md";

const NewItem = () => {
  return (
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

                  try {
                    const response = await fetch(
                      "https://elgoog-drive.s3.ap-south-1.amazonaws.com/images/h.png?x-id=PutObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ6SEYNL67JF6M66T%2F20230922%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230922T193452Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Signature=6601c3a57bcc0a02334c5cee365b0d3cc3f636809d8177e958c5892f012f655f",
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "image/png",
                        },
                        body: e.target.files[0],
                      }
                    );

                    if (response.ok) {
                      alert("File uploaded successfully!");
                    } else {
                      alert("Error uploading file.");
                    }
                  } catch (error) {
                    console.error("An error occurred:", error);
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
          <a>Create Folder</a>
        </li>
      </ul>
    </div>
  );
};

export default NewItem;
