import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Sidebar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 relative ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div
        className="w-[50px] h-[50px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 text-gray-700 shadow-lg cursor-pointer fixed bottom-[20px] left-[10px]"
        onClick={handleLogout}
      >
        <BiLogOutCircle className="w-[25px] h-[25px]" />
      </div>

      {input.length > 0 && (
        <div className="flex top-[250px] w-[100%] bg-white h-[500px] overflow-y-auto flex-col gap-[10px] absolute z-[150] items-center pt-[20px] mt-[15px] shadow-lg">
          {searchData?.map((user) => (
            <div
              className="w-[95%] h-[70px] flex items-center gap-[20px] bg-white px-[10px] hover:bg-[#5293c2] cursor-pointer border-b-2 border-gray-400"
              onClick={() => {
                if (user._id !== userData._id) {
                  dispatch(setSelectedUser(user));
                  setInput("");
                  setSearch(false);
                }
              }}
            >
              <div className="relative rounded-full shadow-gray-500 shadow-lg bg-white flex items-center justify-center">
                <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center ml-1">
                  <img
                    src={user.image || dp}
                    className="h-[100%] mb-2"
                    alt="Image"
                  />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[20px]">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
        </div>
      )}

      <div className="w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]">
        <h1 className="text-white font-bold text-[25px]">Chatifay</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-800 font-bold text-[25px]">
            Hi, {userData.name || "User"}
          </h1>
          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center bg-white items-center shadow-gray-500 shadow-lg cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img src={userData.image || dp} className="h-[100%]" alt="Image" />
          </div>
        </div>
        <div className="w-full flex items-center gap-[20px] overflow-y-auto py-[15px]">
          {!search && (
            <div
              className="w-[50px] h-[50px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 shadow-lg cursor-pointer"
              onClick={() => setSearch(true)}
            >
              <IoSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative">
              <IoSearch className="w-[25px] h-[25px]" />
              <input
                className="w-full h-full border-0 outline-none text-[17px]"
                type="text"
                placeholder="search users..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={() => (setSearch(false), setInput(""))}
              />
            </form>
          )}
          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    className="relative rounded-full shadow-gray-500 shadow-lg bg-white flex items-center justify-center mt-[10px] cursor-pointer"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                      <img
                        src={user.image || dp}
                        className="h-[100%]"
                        alt="Image"
                      />
                    </div>
                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md"></span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* list of user */}

      <div className="w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
        {otherUsers?.map((user) => (
          <div
            className="w-[95%] h-[62px] flex items-center gap-[20px] shadow-gray-500 shadow-lg bg-white rounded-full hover:bg-[#5293c2] cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full shadow-gray-500 shadow-lg bg-white flex items-center justify-center mt-[10px]">
              <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center ml-1">
                <img src={user.image || dp} className="h-[100%]" alt="Image" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md"></span>
              )}
            </div>
            <h1 className="text-gray-800 font-semibold text-[20px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
