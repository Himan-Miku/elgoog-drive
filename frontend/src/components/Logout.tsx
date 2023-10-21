"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";

type LogoutProps = {
  image: string;
};

const Logout = ({ image }: LogoutProps) => {
  return (
    <div className="dropdown dropdown-left">
      <label tabIndex={0}>
        <Image
          src={image}
          alt={`Avatar`}
          height={40}
          width={40}
          className="rounded-full cursor-pointer"
        />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu shadow bg-custom-backg rounded-box font-semibold mt-5 -translate-y-6 -translate-x-5"
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
