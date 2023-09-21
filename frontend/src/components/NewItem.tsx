"use client";

import { AiOutlinePlus } from "react-icons/ai";

const NewItem = () => {
  return (
    <div
      role="button"
      className="flex gap-3 min-w-fit w-1/2 items-center justify-center min-h-fit h-14 px-2 border-[0.25px] border-gray-500 rounded-xl text-[#e6e6e6] bg-custom-backg bg-opacity-50 hover:bg-opacity-70 hover:-translate-y-[0.175rem] transition-all duration-200 hover:shadow-sm hover:shadow-[#e6e6e6]"
    >
      <AiOutlinePlus size={"1.5em"} />
      <h5 className="mr-[0.25rem]">New</h5>
    </div>
  );
};

export default NewItem;
