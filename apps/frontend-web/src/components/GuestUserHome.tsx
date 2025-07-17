import { FcGoogle } from "react-icons/fc";
import { Dialog, DialogContent } from "./ui/dialog";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { Link } from "react-router-dom";
import { useBoardStore } from "../store/atoms";
import { Button } from "./ui/button";
import SideBar from "./SideBar";
import { useTheme } from "./ThemeProvider";
import { boardColorsList } from "../config";
import AnimatedChessBoard from "./AnimatedChessBoard";
import PlayerCard from "./PlayerCard";
import { motion } from "framer-motion";

type CardValues = "LOG_IN" | "SIGN_UP" | null;

export default function GuestUserHome() {
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
      className={`min-h-screen min-w-screen flex flex-col items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      {window.innerWidth < 640 ? (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0.8 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute left-0"
        >
          <SideBar />
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0.8 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute left-0"
        >
          <SideBar />
        </motion.div>
      )}

      <div className="flex flex-col items-center min-h-screen min-w-screen sm:pl-[50px] gap-10 xsmd:gap-8">
        <div className="max-sm:mt-[80px] mt-[40px]">
          <h1 className="pb-[4px] text-3xl xsmd:text-5xl smd:text-6xl font-bold font-dream smd:mb-2 bg-gradient-to-br dark:bg-gradient-to-r dark:from-green-600 dark:to-blue-600 dark:bg-clip-text dark:text-transparent">
            Play Chess Online
          </h1>
          <h2 className="flex justify-center text-lg xsmd:text-2xl smd:text-3xl font-semibold font-proza text-[] dark:text-[#A1A1AA] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-transparent bg-clip-text">
            # New World of Chess
          </h2>
        </div>
        <div className="xsmd:flex-grow flex flex-col justify-center">
          <div className="flex max-md:flex-col justify-center  items-start xsmd:items-center md:gap-6 lg:gap-10 flex-wrap">
            <div className="flex flex-col px-1">
              <PlayerCard
                player="Sergey Karjakin"
                color="b"
                imageUrl="/karjakin.png"
                title="GM"
                rating={2732}
              />
              <AnimatedChessBoard
                customClass="aspect-square max-w-[min(90vh,380px)] smd:w-[380px] smd:h-[380px] rounded-lg overflow-hidden dark:border-2 dark:border-[#27272A]"
                customClassPieces="w-[40px]"
              />
              <PlayerCard
                player="Vasyl Ivanchuk"
                color="w"
                imageUrl="/ivanchuk.png"
                title="GM"
                rating={2751}
              />
            </div>
            <div className="max-sm:hidden flex flex-col justify-center px-[20px] gap-6 w-full md:w-[350px] h-[500px] relative">
              <motion.img
                src="/monster_nobg.png"
                className="absolute top-3 inset-x-1 mx-auto w-[280px] z-0 dark:opacity-80"
                animate={{ translateY: [38, -22, 38] }}
                transition={{
                  duration: 8,
                  ease: "anticipate",
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              ></motion.img>

              <div className="z-10 flex flex-col justify-center  w-full px-[20px] h-[200px] bg-[#8CA2AD] rounded-xl  dark:bg-[#09090B] dark:border-2 dark:border-[#27272A]">
                <a className="max-md:px-4 flex justify-center items-center h-[50px] gap-2 text-lg font-dream font-medium bg-[#d6dce0] dark:bg-white dark:hover:bg-[#E2E2E2] hover:shadow-lg transition-shadow rounded-full cursor-pointer">
                  <FcGoogle className="my-[3px] text-2xl" /> Continue with
                  Google
                </a>
                <hr className="my-[10px] dark:text-[#27272A]" />
                <Button
                  onClick={() => setCard("SIGN_UP")}
                  className="w-full h-[50px] text-lg bg-[#d6dce0] hover:shadow-sm  dark:bg-white dark:hover:bg-[#E2E2E2] rounded-full cursor-pointer font-dream"
                >
                  Create an Account
                </Button>
                <div className="flex gap-2 mt-[10px] justify-center w-full text-sm dark:text-[#A1A1AA] font-proza">
                  Already on Chezz.com?
                  <div
                    onClick={() => setCard("LOG_IN")}
                    className="underline underline-offset-2 cursor-pointer dark:text-white font-dream"
                  >
                    LogIn
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
                className={`relative w-full h-[80px] ${theme === "light" ? "bg-[#272730] text-white hover:text-black hover:border-2" : ""} dark:bg-green-600 dark:hover:bg-green-700 duration-400 transition-normal ease-out cursor-pointer`}
              >
                <div className="absolute -top-2 w-full h-2 blur-md dark:bg-green-700" />
                <div className="absolute -right-2 w-2 h-full blur-md dark:bg-green-700" />
                <div className="absolute -left-2 w-2 h-full blur-md dark:bg-green-700" />
                <div className="absolute -bottom-2 w-full h-2 blur-md dark:bg-green-700" />
                <Link
                  to="/play"
                  className="flex justify-center items-center text-3xl rounded-xl flex-wrap font-dream"
                >
                  Play as Guest
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
