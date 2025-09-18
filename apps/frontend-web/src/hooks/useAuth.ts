import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUserInfoStore } from "../store/atoms";

export default function useAuth() {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/user/me");
      setUserInfo({ ...data.user, isGuest: false });
      console.log(data.user);
      setIsUserLoading(false);
    } catch {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {

    if (!userInfo || !userInfo.id) {
      fetchMe();
    } else {
      setUserInfo(userInfo);
      setIsUserLoading(false);
    }
  }, []);

  return { user: userInfo, isUserLoading, refresh: fetchMe };
}
