import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState({
    username: "",
    rating: 0,
  });
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data.user);
      console.log(data.user);
      setUserInfoLoading(false);
    } catch {
      setUserInfoLoading(false);
      alert("unable to load user details");
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, userInfoLoading, refresh: fetchMe };
}
