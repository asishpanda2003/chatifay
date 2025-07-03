// useCurrentUser.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOtherUsers } from "../redux/userSlice";
import { serverUrl } from "../main";

const useOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    if (userData) {
      fetchUser();
    }
  }, [userData]);
};

export default useOtherUsers;
