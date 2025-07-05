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
import { BookOpen, Puzzle, Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AnimatedChessBoard from "./AnimatedChessBoard";
import PlayerCard from "./PlayerCard";

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
      <SideBar position="fixed" />
      <div className="flex flex-col items-center min-h-screen min-w-screen">
        <div className="mt-[40px]">
          <h1 className="pb-[4px] text-6xl font-bold mb-4 bg-gradient-to-br dark:bg-gradient-to-r dark:from-green-600 dark:to-blue-600 dark:bg-clip-text dark:text-transparent">
            Play Chess Online
          </h1>
          <h2 className="flex justify-center text-3xl font-semibold text-[] dark:text-[#A1A1AA]">
            # New World of Chess
          </h2>
        </div>
        <div className="flex-grow pl-[30px] flex flex-col justify-center">
          <div className="flex justify-center items-center md:gap-5">
            <div className="flex flex-col">
              <PlayerCard
                player="Sergey Karjakin"
                color="b"
                imageUrl="/karjakin.png"
                title="GM"
                rating={2732}
              />
              <AnimatedChessBoard
                customClass="w-[380px] h-[380px] rounded-lg overflow-hidden dark:border-2 dark:border-[#27272A]"
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
            <div className="flex flex-col justify-center px-[20px] gap-6 w-[350px] h-[500px]">
              <div className="flex flex-col justify-center  w-full px-[20px] h-[200px] bg-[#8CA2AD] rounded-xl  dark:bg-[#09090B] dark:border-2 dark:border-[#27272A]">
                <a className="flex justify-center items-center h-[50px] gap-2 text-lg bg-[#d6dce0] dark:bg-white dark:hover:bg-[#E2E2E2] hover:shadow-lg transition-shadow rounded-full cursor-pointer">
                  <FcGoogle className="my-[3px] text-2xl" /> Continue with
                  Google
                </a>
                <hr className="my-[10px] dark:text-[#27272A]" />
                <Button
                  onClick={() => setCard("SIGN_UP")}
                  className="w-full h-[50px] text-lg bg-[#d6dce0] dark:bg-white dark:hover:bg-[#E2E2E2] rounded-full cursor-pointer "
                >
                  Create an Account
                </Button>
                <div className="flex gap-2 mt-[10px] justify-center w-full text-sm dark:text-white">
                  Already on Chezz.com?
                  <div
                    onClick={() => setCard("LOG_IN")}
                    className="underline underline-offset-2 cursor-pointer"
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
                className={`w-full h-[80px] ${theme === "light" ? "bg-[#272730] text-white hover:text-black hover:border-2" : ""} dark:bg-green-600 dark:hover:bg-green-700`}
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
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-[900px] m-10">
        <Card className="hover:shadow-lg transition-shadow bg-white/30 backdrop-blur-md shadow-md dark:bg-[#09090B] dark:border-[#27272A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white text-2xl">
              <Play className="w-5 h-5 text-green-600" />
              Play Online
            </CardTitle>
            <CardDescription className="text-[#272730] dark:text-[#A1A1AA]">
              Play with someone at your level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-[#272730] dark:text-[#A1A1AA]">
              Challenge players from around the world in real-time matches.
            </p>
            <Button
              asChild
              className="w-full bg-[#8CA2AD] hover:border-1  dark:bg-white dark:hover:bg-[#E2E2E2] dark:border-[#27272A]"
            >
              <Link to="/play">Start Playing</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white/30 backdrop-blur-md shadow-md dark:bg-[#09090B] dark:border-[#27272A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white text-2xl">
              <Puzzle className="w-5 h-5 text-blue-600" />
              Solve Puzzles
            </CardTitle>
            <CardDescription className="text-[#272730] dark:text-[#A1A1AA]">
              Improve your tactical skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-[#272730] dark:text-[#A1A1AA]">
              Practice with hundreds of chess puzzles and tactics.
            </p>
            <Button
              asChild
              className="w-full bg-[#8CA2AD] hover:border-1  dark:bg-white dark:hover:bg-[#E2E2E2] dark:border-[#27272A]"
            >
              <Link to="/puzzles">Try Puzzles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white/30 backdrop-blur-md shadow-md dark:bg-[#09090B] dark:border-[#27272A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white text-2xl">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Learn Chess
            </CardTitle>
            <CardDescription className="text-[#272730] dark:text-[#A1A1AA]">
              Master the game step by step
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-[#272730] dark:text-[#A1A1AA]">
              Analyze your game and get upskill your game.
            </p>
            <Button
              asChild
              className="w-full bg-[#8CA2AD] hover:border-1 dark:bg-white dark:hover:bg-[#E2E2E2] dark:border-[#27272A]"
            >
              <Link to="/learn">Start Learning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
