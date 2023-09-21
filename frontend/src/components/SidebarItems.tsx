"use client";
import Sidebaritems from "@/lib/utils/Sidebaritems";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const SidebarItems = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1 py-3 px-1">
      {Sidebaritems.map((item) => (
        <div
          key={item.title}
          role="button"
          className={clsx(
            "py-2 pl-5 flex gap-4 items-center rounded-3xl hover:bg-custom-backg",
            {
              "bg-custom-blue hover:bg-custom-blue": pathname === item.path,
            }
          )}
        >
          <div>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="#e6e6e6">
              <path d={item.svgPath}></path>
            </svg>
          </div>
          <div>
            <h3 className="text-[#e6e6e6]">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarItems;
