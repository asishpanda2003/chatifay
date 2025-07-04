import React, { useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { IoCamera } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState(userData.name || "");
  const [frontendimage, setFrontendImage] = useState(userData.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setTimeout(() => {
        setSaving(false);
        navigate("/")
      }, 50);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]">
      <div
        className="fixed top-[20px] left-[20px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdArrowRoundBack className="w-[30px] h-[30px] text-gray-600" />
      </div>
      <div
        className="bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg relative"
        onClick={() => image.current.click()}
      >
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center">
          <img src={frontendimage} className="h-[100%]" alt="Image" />
        </div>
        <div className="absolute bottom-4 text-gray-700 right-4 w-[35px] h-[35px] rounded-full bg-[#20c7ff] flex justify-center items-center shadow-gray-400 shadow-lg">
          <IoCamera className="text-gray-700 w-[25px] h-[25px]" />
        </div>
      </div>
      <form
        className="w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
        />
        <input
          type="text"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]"
          value={userData?.userName}
        />
        <input
          type="email"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]"
          value={userData?.email}
        />
        <button
          className="px-[20px] py-[10px] rounded-2xl bg-[#20c7ff] shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
          disabled={saving}
        >
          {saving ? "saving.." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
