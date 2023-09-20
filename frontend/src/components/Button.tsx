"use client";

const yourMom = () => {
  document.querySelector(".sidebar")?.classList.toggle("display-none");
};

const Button = () => {
  return (
    <div>
      <button onClick={yourMom}>Hide</button>
    </div>
  );
};

export default Button;
