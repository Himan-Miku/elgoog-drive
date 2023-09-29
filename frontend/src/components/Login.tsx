"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>
        <Image
          src="/Drive-logo-removebg.png"
          alt="Girl Pic"
          width={256}
          height={256}
        />
      </div>
      <div className="w-64 min-w-[16rem] grid justify-center border-t-4 rounded border-[#22272B] py-2">
        <button
          className="min-w-max w-max px-3 py-4 rounded-lg bg-[#22272B]"
          onClick={() => signIn()}
        >
          <p className="text-white tracking-wider">Sign In To Elgoog Drive</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
