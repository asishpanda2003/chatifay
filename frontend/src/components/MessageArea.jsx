import React, { useEffect, useRef } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "./SenderMessage";
import ReceiverMesssage from "./ReceiverMesssage";

function MessageArea() {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(setMessages([]));
  }, [dispatch, selectedUser]);
  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const image = useRef();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImage == null) {
      return null;
    }
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setMessages]);

  return (
    <div
      className={`lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col">
          <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoMdArrowRoundBack className="w-[30px] h-[30px] text-white" />
            </div>
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center bg-white items-center shadow-gray-500 shadow-lg cursor-pointer">
              <img
                src={selectedUser?.image || dp}
                className="h-[100%]"
                alt="Image"
              />
            </div>
            <h1 className="text-white font-bold text-[20px]">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          <div className="w-full h-[70%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]">
            {showPicker && (
              <div className="absolute bottom-[100px] left-[20px]">
                <EmojiPicker
                  width={250}
                  height={350}
                  className="shadow-lg z-[100]"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            {messages &&
              messages.map((mess) =>
                mess.sender == userData._id ? (
                  <SenderMessage image={mess.image} message={mess.message} />
                ) : (
                  <ReceiverMesssage image={mess.image} message={mess.message} />
                )
              )}
          </div>
        </div>
      )}
      {!selectedUser && (
        <div className="w-full h-full flex justify-center flex-col items-center">
          <h1 className="text-gray-700 font-bold text-[50px]">
            Welcome to Chatifay
          </h1>
          <span className="text-gray-700 font-semibold text-[40px]">
            Chat Friendly..
          </span>
        </div>
      )}

      {selectedUser && (
        <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center">
          <img
            src={frontendImage}
            className="absolute w-[80px] bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg"
            alt=""
          />
          <form
            className="w-[95%] lg:w-[70%] h-[60px] bg-[rgb(23,151,194)] shadow-gray-400 rounded-full shadow-lg flex items-center gap-[20px] px-[20px] relative"
            onSubmit={handleSendMessage}
          >
            <div onClick={() => setShowPicker((prev) => !prev)}>
              <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={image}
              onChange={handleImage}
            />
            <input
              type="text"
              className="w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white"
              placeholder="Type message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e);
                }
              }}
            />
            <div onClick={() => image.current.click()}>
              <FaImages className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            {(input.length > 0 ||
              (backendImage !== null && input.length === 0)) && (
              <button>
                <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
