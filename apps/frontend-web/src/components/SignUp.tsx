import { FcGoogle } from "react-icons/fc";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../store/atoms";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";

export default function SignUp() {
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);
  const [isOtpSend, setIsOtpSend] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const handleSendOtp = async () => {
    if (isLoadingSendOtp) return;
    try {
      console.log("hi");
      setIsLoadingSendOtp(true);
      const { data: csrf } = await api.get("/csrf-token");
      console.log(csrf);
      const res = await api.post(
        "/send-otp",
        { email },
        { headers: { "csrf-token": csrf.csrfToken } }
      );

      const data = res.data;
      if (!data.error) {
        setIsOtpSend(true);
      }
      console.log(data);
      setIsLoadingSendOtp(false);
    } catch (e) {
      setIsLoadingSendOtp(false);
      console.log(e);
      alert("Failed Sending Otp");
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpSend) return;
    try {
      setIsLoadingVerifyOtp(true);
      const { data: csrf } = await api.get("/csrf-token");
      console.log(csrf);
      const res = await api.post(
        "/signup",
        { username, email, password, otp },
        { headers: { "csrf-token": csrf.csrfToken } }
      );

      const data = res.data;

      if (data.error) {
        setIsLoadingVerifyOtp(false);
        return;
      }

      localStorage.setItem("authToken", data.authToken);

      setUserInfo({
        isGuest: false,
        id: data.id,
        username: data.username,
        email: data.email,
        ratings: data.ratings,
      });

      console.log(data);
      setIsLoadingVerifyOtp(false);
      navigate("/home");
    } catch (e) {
      setIsLoadingVerifyOtp(false);
      console.log(e);
      alert("Signup failed unable to send request");
    }
  };

  const [doesUsernameExist, setDoesUsernameExist] = useState<boolean | null>(
    null
  );
  const [isLoadingDoesUsernameExist, setIsLoadingDoesUsernameExist] =
    useState(false);

  useEffect(() => {
    if (!username) {
      setDoesUsernameExist(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoadingDoesUsernameExist(true);
        const res = await api.get(`/check/username/${username}`);
        const data = res.data;
        console.log(data);
        setIsLoadingDoesUsernameExist(false);
        if (!data.error) {
          setDoesUsernameExist(data.doesUsernameExist);
          return;
        }
        setDoesUsernameExist(null);
      } catch (e) {
        console.log(e);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  return (
    <DialogHeader className="flex justify-center items-center gap-3 font-dream">
      {isOtpSend ? (
        <>
          <DialogTitle className="text-3xl">Verify your Email</DialogTitle>
          <DialogDescription className="text-center font-proza">
            {`Enter it below to verify ${email}`}
          </DialogDescription>

          <motion.div
            className="w-[300px] flex flex-col items-center gap-3 mt-[10px]"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleVerifyOtp();
            }}
          >
            <div className="flex flex-col gap-4 w-full items-center">
              <InputOTP onChange={(value) => setOtp(value)} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                  <InputOTPSlot
                    index={1}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                  <InputOTPSlot
                    index={2}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                  <InputOTPSlot
                    index={3}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                  <InputOTPSlot
                    index={4}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                  <InputOTPSlot
                    index={5}
                    className="bg-white/30 data-[active=true]:border-white/40 border-white/40"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={isLoadingVerifyOtp}
              className="mt-[20px] text-white text-xl h-[50px] w-[150px] bg-[black] rounded-full"
            >
              {isLoadingVerifyOtp ? (
                <div className="flex gap-3 w-full justify-center items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-dotted border-[#8CA2AD] dark:border-green-600"></div>
                  <div>Verifying OTP</div>
                </div>
              ) : (
                "Verify Otp"
              )}
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <DialogTitle className="text-3xl">Create your account</DialogTitle>
          <DialogDescription className="text-center font-proza text-slate-800">
            Create free account & start playing online chess!
          </DialogDescription>
          <motion.div
            className="w-[300px] flex flex-col items-center gap-3 mt-[10px]"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSendOtp();
            }}
          >
            <a
              href="http://localhost:3000/auth/google"
              className="w-full flex justify-center items-center h-[50px] gap-2 text-lg rounded-full cursor-pointer bg-white/30 backdrop-blur-md shadow-md border border-white/40"
            >
              <FcGoogle className="my-[3px] text-2xl" /> Continue with Google
            </a>
            <hr className="my-[14px] h-[2px] w-full text-white" />
            <div className="relative w-full">
              {isLoadingDoesUsernameExist ? (
                <span className="flex items-center gap-1 absolute -top-5 right-0">
                  <span className="text-xs animate-spin rounded-full h-2 w-2 border-2 border-dotted border-black dark:border-white" />
                  <span className="text-xs dark:text-white">checking</span>
                </span>
              ) : doesUsernameExist != null ? (
                doesUsernameExist ? (
                  <span className="text-xs text-red-800 absolute -top-5 right-0">
                    username already taken
                  </span>
                ) : (
                  <span className="text-xs text-green-500 absolute -top-5 right-0">
                    username available
                  </span>
                )
              ) : (
                <></>
              )}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${doesUsernameExist == null || isLoadingDoesUsernameExist ? "focus:outline-slate-600" : !doesUsernameExist ? "focus:outline-green-700" : "focus:outline-red-700"} focus:outline-2 font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg font-proza`}
              />
            </div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`focus:outline-slate-600 focus:outline-2 font-medium px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg font-proza`}
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:outline-slate-600 focus:outline-2 font-medium pl-[10px] pr-6 sm:pr-8 h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg font-proza"
              />
              <span
                className="absolute right-1.5 inset-y-0 flex items-center"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                  setTimeout(() => {
                    passwordRef.current?.focus();
                  }, 0);
                }}
              >
                {" "}
                {showPassword ? (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                ) : (
                  <EyeOff className=" w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                )}
              </span>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isLoadingSendOtp}
              className="mt-[20px] text-white text-xl h-[50px] w-[150px] bg-[black] rounded-full"
            >
              {isLoadingSendOtp ? (
                <div className="flex gap-1 w-full justify-center items-center">
                  <div className="animate-spin  rounded-full h-4 w-4 border-2 border-dotted border-[#8CA2AD] dark:border-green-600"></div>
                  <div>Sending OTP</div>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </motion.div>
        </>
      )}
    </DialogHeader>
  );
}
