"use client";
import React, { useState } from "react";

const CopyButton = ({ url }: { url: string }) => {
  const [buttonText, setButtonText] = useState("Copy");

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url);
    setButtonText("Copied");
    setTimeout(() => {
      setButtonText("Copy");
    }, 3000);
  };

  return (
    <button
      onClick={handleCopyClick}
      className="btn-sm rounded-md bg-custom-nav hover:bg-custom-green hover:text-custom-backg font-semibold"
    >
      {buttonText}
    </button>
  );
};

export default CopyButton;
