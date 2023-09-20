import Image from "next/image";
import NewItem from "./NewItem";
import SidebarItems from "./SidebarItems";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex justify-start items-center gap-2">
        <Image
          src={"/Drive-logo-removebg.png"}
          alt={"Drive Logo"}
          width={64}
          height={64}
        />
        <div className="text-xl font-medium text-custom-green">
          <h3>
            Elgoog <span className="text-custom-blue">Drive</span>
          </h3>
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
