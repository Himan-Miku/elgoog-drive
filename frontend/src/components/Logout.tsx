"use client";
import { IResizeContext, resizeContext } from "@/context/ResizeContext";
import { signOut } from "next-auth/react";
import Image from "next/image";

type LogoutProps = {
  image: string;
};

const Logout = ({ image }: LogoutProps) => {
  const { isMobile } = resizeContext() as IResizeContext;

  return (
    <div className="dropdown dropdown-left">
      <label tabIndex={0}>
        <Image
          src={image}
          alt={`Avatar`}
          height={isMobile ? 32 : 40}
          width={isMobile ? 32 : 40}
          className="rounded-full cursor-pointer"
        />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu shadow bg-custom-backg rounded-box font-semibold mt-5 md:-translate-y-6 -translate-y-7 md:-translate-x-5 -translate-x-2"
      >
        <li>
          <button onClick={() => signOut()} className="text-custom-green">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Logout;
