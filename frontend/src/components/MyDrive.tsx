"use client";
import { IoCaretDown } from "react-icons/io5";

const MyDrive = () => {
  return (
    <div className="pt-5 px-8">
      <div
        role="button"
        className="text-custom-green min-w-fit w-32 py-2 rounded-xl hover:bg-custom-nav flex gap-2 items-center justify-center"
      >
        <h5 className="text-xl font-semibold">My Drive</h5>
        <IoCaretDown />
      </div>
      <div className="min-w-fit w-32 py-3 px-[0.6rem]">
        <h6 className="text-sm font-medium text-gray-500">Suggested</h6>
      </div>
    </div>
  );
};

export default MyDrive;
