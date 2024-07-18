"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: React.ReactNode;
};

export interface IResizeContext {
  isMobile: boolean;
  setIsMobile: Dispatch<SetStateAction<boolean>>;
}

const ResizeContext = createContext<IResizeContext | null>(null);

export const ResizeContextProvider = ({ children }: Props) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  console.log(windowWidth);
  console.log(isMobile);

  return (
    <ResizeContext.Provider value={{ isMobile, setIsMobile }}>
      {children}
    </ResizeContext.Provider>
  );
};

export const resizeContext = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(ResizeContext);
};
