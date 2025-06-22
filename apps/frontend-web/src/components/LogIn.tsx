import { FcGoogle } from "react-icons/fc";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../store/atoms";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data: csrf } = await api.get("/csrf-token");

      const res = await api.post(
        "/login",
        { username, password },
        { headers: { "csrf-token": csrf.csrfToken } }
      );

      const data = res.data;

      setUserInfo({
        isGuest: false,
        username: data.username,
        rating: data.rating,
      });

      console.log(data);
      navigate("/home");
    } catch {
      alert("Login failed.");
    }
  };

  return (
    <DialogHeader className="flex justify-center items-center gap-8 ">
      <DialogTitle className="text-3xl">Log In & Play</DialogTitle>
      <DialogDescription className="text-center">
        Welcome back! Enter your account to continue.
      </DialogDescription>

      <div className="w-[300px] flex flex-col items-center gap-3 mt-[10px]">
        <a
          href="http://localhost:3000/auth/google"
          className="w-full flex justify-center items-center h-[50px] gap-2 text-lg rounded-full cursor-pointer bg-white/30 backdrop-blur-md shadow-md border border-white/40"
        >
          <FcGoogle className="my-[3px] text-2xl" /> Continue with Google
        </a>
        <hr className="my-[10px] h-[2px] w-full text-white" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg"
        />
        <button
          onClick={handleLogin}
          className="mt-[20px] text-white text-xl h-[50px] w-[150px] bg-[black] rounded-full"
        >
          Log In
        </button>
      </div>
    </DialogHeader>
  );
}
