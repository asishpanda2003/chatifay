// useCurrentUser.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useMessage = () => {
  const dispatch = useDispatch();
  const { userData,selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
      fetchMessage();
  }, [selectedUser,userData]);
};

export default useMessage;
