import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

function Signup() {
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate('/profile')
      setUserName("");
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[500px] h-[650px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Welcome to <span className="text-white">Chatify</span>
          </h1>
        </div>
        <form
          onSubmit={handleSignup}
          className="w-full flex flex-col gap-[20px] items-center"
        >
          <input
            type="text"
            onChange={(e) => {
              setUserName(e.target.value);
              if (error) setError("");
            }}
            value={userName}
            placeholder="Enter username"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
          />
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            value={email}
            placeholder="Enter email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
          />
          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              type={show ? "text" : "password"}
              value={password}
              placeholder="Enter password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-[white] text-gray-700 text-[19px]"
            />
            <span
              className="absolute top-[10px] right-[20px] text-[19px] text-[#20c7ff] font-semibold cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "hidden" : "show"}
            </span>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="px-[20px] py-[10px] rounded-2xl bg-[#20c7ff] shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>

          <p className="cursor-pointer">
            Already have an Account?{" "}
            <Link to="/login">
              <span className="text-[#20c7ff] font-bold">Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
