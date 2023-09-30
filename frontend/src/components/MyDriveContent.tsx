"use client";
import { objectNamesStore } from "@/context/ObjectsContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

const list_objects = async (name: string) => {
  const res = await fetch(`http://localhost:8000/api/getObjects?name=${name}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as Array<string>;
  return data;
};

const MyDriveContent = () => {
  const { objectNames, setObjectNames } = objectNamesStore();
  const { data: session } = useSession();
  let username = session?.user?.name?.split(" ")[0];

  useEffect(() => {
    const fetchData = async () => {
      const data = await list_objects(username!);
      setObjectNames(data);
    };
    fetchData();
  }, [objectNames]);

  return (
    <div className="px-8 py-2 grid grid-cols-5 gap-4">
      {objectNames?.map((obj, index) => {
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
            className="w-full bg-custom-nav px-3 pt-2 pb-3 rounded-xl h-52 flex flex-col gap-2"
          >
            <div className="flex gap-2 px-2 py-2">
              <Image
                src={smImageSrc}
                alt="small-image"
                height={20}
                width={24}
                className="w-5"
              />
              <h3 className="text-[#e6e6e6] text-sm font-medium">
                {obj.substring(obj.indexOf("/") + 1, obj.length).length > 18
                  ? obj
                      .substring(obj.indexOf("/") + 1, obj.length)
                      .substring(0, 18) + "..."
                  : obj.substring(obj.indexOf("/") + 1, obj.length)}
              </h3>
            </div>
            <div className="w-full grid place-content-center flex-grow bg-custom-backg h-20 rounded-xl">
              <Image src={imageSrc} alt="big-image" height={64} width={64} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyDriveContent;
