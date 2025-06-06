import { FcGoogle } from "react-icons/fc";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useState } from "react";
import SignUp from "../components/SignUp";
import LogIn from "../components/LogIn";

type CardValues = "LOG_IN" | "SIGN_UP" | null;

export default function Home() {
  const [card, setCard] = useState<CardValues>(null);

  const closeDialog = () => setCard(null);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex gap-2">
        "Life is like chess—sometimes, the most powerful move is not in taking,
        but in waiting."
        <div className="flex items-end text-sm"> — someone </div>
      </div>
      <div className="xsm:px-[20px] flex flex-col justify-center md:flex-row items-center md:gap-5">
        <img
          src="/chessBoard.png"
          className="w-[240px] xsm:w-full md:w-[500px]"
        />
        <div className="flex flex-col justify-center px-[20px] gap-5 w-[350px] h-[600px]">
          <div className="flex flex-col justify-center  w-full px-[20px] h-[200px] bg-[#8CA2AD] rounded-xl">
            <div className="flex justify-center items-center h-[50px] gap-2 text-lg bg-[#d6dce0] rounded-full cursor-pointer">
              <FcGoogle className="my-[3px] text-2xl" /> Continue with Google
            </div>
            <hr className="my-[10px]" />
            <button
              onClick={() => setCard("LOG_IN")}
              className="w-full h-[50px] text-lg bg-[#d6dce0] rounded-full"
            >
              LogIn with Username
            </button>
            <div className="flex gap-2 mt-[10px] justify-center w-full text-sm">
              New on Chezz.com?{" "}
              <button
                onClick={() => setCard("SIGN_UP")}
                className="underline underline-offset-2"
              >
                Sign Up
              </button>
            </div>
          </div>

          <Dialog
            open={card !== null}
            onOpenChange={(open) => !open && closeDialog()}
          >
            <DialogContent className="w-[400px] h-[500px] border-none bg-white/30 backdrop-blur-3xl rounded-xl shadow-md">
              {card === "LOG_IN" ? (
                <LogIn />
              ) : card === "SIGN_UP" ? (
                <SignUp />
              ) : null}
            </DialogContent>
          </Dialog>

          <a
            href="/play"
            className="w-full h-[80px] bg-[#d6dce0] flex justify-center items-center text-3xl rounded-xl"
          >
            Play as Guest
          </a>
        </div>
      </div>
    </div>
  );
}
