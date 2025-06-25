import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUserInfoStore } from "../store/atoms";

export default function useAuth() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    rating: 0,
  });
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data.user);
      setUserInfo({ ...user, isGuest: false });
      console.log(data.user);
      setUserInfoLoading(false);
    } catch {
      setUserInfoLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, userInfoLoading, refresh: fetchMe };
}
