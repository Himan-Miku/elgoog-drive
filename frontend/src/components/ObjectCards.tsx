"use client";
import Image from "next/image";
import { SlOptionsVertical } from "react-icons/sl";
import { MdSimCardDownload, MdStar, MdDelete } from "react-icons/md";

type ObjectCardsProps = {
  data: Array<string>;
};

const ObjectCards = ({ data }: ObjectCardsProps) => {
  return (
    <>
      {data?.map((obj, index) => {
        let imageSrc;
        let smImageSrc;

        console.log("Object : ", obj);

        if (obj.endsWith(".png") || obj.endsWith(".jpeg")) {
          imageSrc = "/image-lg.png";
          smImageSrc = "/image-sm.png";
        } else if (obj.endsWith(".pdf")) {
          imageSrc = "/pdf-lg.png";
          smImageSrc = "/pdf-sm.png";
        } else if (
          obj.endsWith(".mp4") ||
          obj.endsWith(".mov") ||
          obj.endsWith(".wmv")
        ) {
          imageSrc = "/mp4-lg.png";
          smImageSrc = "/mp4-sm.png";
        } else if (
          obj.endsWith(".mp3") ||
          obj.endsWith(".wma") ||
          obj.endsWith(".wav")
        ) {
          imageSrc = "/music-lg.png";
          smImageSrc = "/music-sm.png";
        } else {
          imageSrc = "/docs-lg.png";
          smImageSrc = "/docs-sm.png";
        }

        console.log("imageSrc:", imageSrc);
        return (
          <div
            key={index}
            className="w-full bg-custom-nav px-3 pt-2 pb-3 rounded-xl h-52 flex flex-col gap-2 group"
          >
            <div className="flex gap-2 px-2 py-2 items-center justify-between">
              <Image
                src={smImageSrc}
                alt="small-image"
                height={20}
                width={24}
                className="w-5"
              />
              <h3 className="text-[#e6e6e6] text-sm font-medium group-hover:text-blue-400 transition-all duration-300 ease-in-out">
                {obj.substring(obj.indexOf("/") + 1, obj.length).length > 14
                  ? obj
                      .substring(obj.indexOf("/") + 1, obj.length)
                      .substring(0, 14) + "..."
                  : obj.substring(obj.indexOf("/") + 1, obj.length)}
              </h3>
              <div className="dropdown dropdown-end translate-x-[14.8px]">
                <div
                  tabIndex={0}
                  className="p-1 rounded-full hover:bg-custom-backg transition-colors duration-300 ease-in-out"
                >
                  <SlOptionsVertical />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-custom-backg border border-custom-nav rounded-box w-[13.5rem] mt-[1.35rem] text-custom-green"
                >
                  <li>
                    <label className="flex gap-6 items-center">
                      <MdSimCardDownload size={"1.5em"} />
                      <h5>Download</h5>
                    </label>
                  </li>
                  <li>
                    <label className="flex gap-6 items-center">
                      <MdStar size={"1.5em"} />
                      <h5>Star</h5>
                    </label>
                  </li>
                  <li>
                    <label className="flex gap-6 items-center">
                      <MdDelete size={"1.5em"} />
                      <h5>Delete</h5>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full grid place-content-center flex-grow bg-custom-backg h-20 rounded-xl">
              <Image src={imageSrc} alt="big-image" height={64} width={64} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ObjectCards;
