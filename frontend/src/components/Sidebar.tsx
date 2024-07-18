"use client";
import Image from "next/image";
import NewItem from "./NewItem";
import SidebarItems from "./SidebarItems";
import { SidebarStore } from "@/context/SidebarContext";
import { RxCross2 } from "react-icons/rx";

const Sidebar = () => {
  const { setShowSidebar } = SidebarStore();
  return (
    <div className="flex flex-col gap-4 px-3 py-2 bg-custom-nav min-h-[100vh]">
      <div className="flex justify-start items-center gap-2">
        <Image
          src={"/Drive-logo-removebg.png"}
          alt={"Drive Logo"}
          width={64}
          height={64}
          priority
        />
        <div className="text-xl font-medium text-custom-green">
          <h3>
            Elgoog <span className="text-custom-blue">Drive</span>
          </h3>
        </div>
        <div className=" rounded-full min-w-fit p-2 group hover:bg-custom-nav md:hidden block pointer">
          <RxCross2
            className=""
            onClick={() => {
              setShowSidebar(!Sidebar);
            }}
            size={26}
          ></RxCross2>
        </div>
      </div>
      <div className="py-2 pl-2">
        <NewItem />
      </div>
      <div className="">
        <SidebarItems />
      </div>
    </div>
  );
};

export default Sidebar;
