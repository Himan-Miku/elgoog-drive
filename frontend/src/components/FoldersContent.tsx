import { foldersData } from "./Folders";
import { FaFolder } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";

interface FoldersContentProps {
  data: foldersData;
}

const FoldersContent = ({ data }: FoldersContentProps) => {
  return (
    <>
      {data.folders_vec?.map((folName, index) => {
        return (
          <div
            className="flex gap-6 items-center py-3 px-4 hover:bg-custom-nav bg-custom-nav min-w-fit rounded-xl"
            key={index}
          >
            <div className="flex gap-2 items-center">
              <FaFolder />
              <h3>{folName.replace(/\/$/, "")}</h3>
            </div>
            <div className="rounded-full p-1 hover:bg-custom-backg">
              <SlOptionsVertical />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FoldersContent;
