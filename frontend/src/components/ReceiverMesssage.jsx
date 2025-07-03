import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function ReceiverMesssage({ image, message }) {
  const { selectedUser } = useSelector((state) => state.user);
  const scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);
  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex items-start gap-[10px]">
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center bg-white items-center shadow-gray-500 shadow-lg cursor-pointer">
        <img src={selectedUser.image || dp} className="h-[100%]" alt="Image" />
      </div>
      <div
        ref={scroll}
        className="w-fit max-w-[500px] bg-[rgb(23,151,194)] px-[20px] py-[10px] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0 shadow-gray-400 shadow-lg gap-[10px] flex flex-col"
      >
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default ReceiverMesssage;
