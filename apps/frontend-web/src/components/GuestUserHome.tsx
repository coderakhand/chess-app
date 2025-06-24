import { FcGoogle } from "react-icons/fc";
import { Dialog, DialogContent } from "./ui/dialog";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { Link } from "react-router-dom";
import { useBgImageStore, useBoardStore } from "../store/atoms";
import { Button } from "./ui/button";
import SideBar from "./SideBar";
import ChessBoard from "./ChessBoard";
import { useTheme } from "./ThemeProvider";
import { boardColorsList } from "../config";

type CardValues = "LOG_IN" | "SIGN_UP" | null;

export default function GuestUserHome() {
  const bgImage = useBgImageStore((state) => state.bgImage);
  const [card, setCard] = useState<CardValues>(null);
  const closeDialog = () => setCard(null);
  const { theme } = useTheme();

  const setDarkSquare = useBoardStore((state) => state.setDarkSquare);
  const setLightSquare = useBoardStore((state) => state.setLightSquare);

  useEffect(() => {
    if (theme === "light") {
      setDarkSquare(boardColorsList[1].darkSquare);
      setLightSquare(boardColorsList[1].lightSquare);
    } else {
      setDarkSquare(boardColorsList[0].darkSquare);
      setLightSquare(boardColorsList[0].lightSquare);
    }
  }, [theme, setDarkSquare, setLightSquare]);

  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center ${bgImage} bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position="fixed" />
      <div className="mt-[40px]">
        <h1 className="text-6xl font-bold mb-4 dark:bg-gradient-to-r dark:from-green-600 dark:to-blue-600 dark:bg-clip-text dark:text-transparent">
          Play Chess Online
        </h1>
        <h2 className="flex justify-center text-3xl font-semibold text-[#A1A1AA]">
          # New World of Chess
        </h2>
      </div>
      <div className="xsm:px-[20px] flex flex-col justify-center md:flex-row items-center md:gap-5">
        <ChessBoard
          winner={null}
          socket={null}
          customClass="w-[380px] h-[380px] rounded-lg overflow-hidden dark:border-2 dark:border-[#27272A]"
        />
        <div className="flex flex-col justify-center px-[20px] gap-5 w-[350px] h-[600px]">
          <div className="flex flex-col justify-center  w-full px-[20px] h-[200px] bg-[#8CA2AD] dark:bg-[#09090B] rounded-xl  dark:border-2 dark:border-[#27272A]">
            <a className="flex justify-center items-center h-[50px] gap-2 text-lg bg-[#d6dce0] dark:bg-white dark:hover:bg-[#E2E2E2] hover:shadow-lg transition-shadow rounded-full cursor-pointer">
              <FcGoogle className="my-[3px] text-2xl" /> Continue with Google
            </a>
            <hr className="my-[10px]" />
            <Button
              onClick={() => setCard("LOG_IN")}
              className="w-full h-[50px] text-lg bg-[#d6dce0] dark:bg-white dark:hover:bg-[#E2E2E2] rounded-full cursor-pointer "
            >
              LogIn with Username
            </Button>
            <div className="flex gap-2 mt-[10px] justify-center w-full text-sm dark:text-white">
              New on Chezz.com?
              <div
                onClick={() => setCard("SIGN_UP")}
                className="underline underline-offset-2 cursor-pointer"
              >
                Sign Up
              </div>
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
          <Button
            size="lg"
            className={`w-full h-[80px] bg-[#d6dce0] ${theme === "light" ? "hover:border-2" : ""} dark:bg-green-600 dark:hover:bg-green-700`}
          >
            <Link
              to="/play"
              className="flex justify-center items-center text-3xl rounded-xl"
            >
              Play as Guest
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
