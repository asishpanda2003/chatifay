// useCurrentUser.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    if (!userData) {
      fetchUser();
    }
  }, [userData]);
};

export default useCurrentUser;
