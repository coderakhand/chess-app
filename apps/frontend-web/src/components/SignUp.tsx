// SignUp.tsx
import { FcGoogle } from "react-icons/fc";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

export default function SignUp() {
  return (
    <DialogHeader className="flex justify-center items-center gap-3 ">
      <DialogTitle className="text-3xl">Create your account</DialogTitle>
      <DialogDescription className="my-[20px]">
        <div className="w-[300px] flex flex-col items-center gap-3">
          <div className="w-full flex justify-center items-center h-[50px] gap-2 text-lg rounded-full cursor-pointer bg-white/30 backdrop-blur-md shadow-md border border-white/40">
            <FcGoogle className="my-[3px] text-2xl" /> Continue with Google
          </div>
          <hr className="my-[10px] h-[2px] w-full text-white" />
          <input
            type="text"
            placeholder="Username"
            className=" font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg"
          />
          <input
            type="text"
            placeholder="Email"
            className="font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="font-semibold px-[10px] h-[40px] w-full bg-white/30 backdrop-blur-md shadow-md border border-white/40 rounded-lg"
          />
          <button className=" text-white text-xl h-[50px] w-[150px] bg-[black] rounded-full">
            Sign Up
          </button>
        </div>
      </DialogDescription>
    </DialogHeader>
  );
}
