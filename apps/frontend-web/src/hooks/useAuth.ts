import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUserInfoStore } from "../store/atoms";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const fetchMe = async () => {
    localStorage.removeItem("authToken");
    try {
      const { data } = await api.get("/user/me");
      setUserInfo({ ...data.user, isGuest: false });
      console.log(data.user);
      setIsUserLoading(false);
    } catch {
      setIsUserLoading(false);
    }
  };

  const userLogout = async () => {
    try {
      const { data: csrf } = await api.get("/csrf-token");
      console.log("sending request");
      const response = await api.post(
        "/logout",
        {},
        { headers: { "csrf-token": csrf.csrfToken } }
      );
      const data = response.data;
      if (data.message) {
        window.location.assign('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      fetchMe();
      return;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(authToken);

      if (!exp || Date.now() >= exp * 1000) {
        userLogout();
        return;
      }

      fetchMe();
    } catch (err) {
      fetchMe();
    }

    const { exp } = jwtDecode(String(authToken));
    if (!authToken || !exp || Date.now() >= exp * 1000) {
      fetchMe();
    }
  }, []);

  return { user: userInfo, isUserLoading, refresh: fetchMe };
}
