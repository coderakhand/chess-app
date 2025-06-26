import { FaChessBoard } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useState } from "react";
import {
  Binoculars,
  Brain,
  Crown,
  Moon,
  Play,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Settings } from "lucide-react";
import { useUserInfoStore } from "../store/atoms";

const hoverEffect =
  " hover:bg-white/30 hover:backdrop-blur-2xl hover:shadow-md  dark:hover:shadow-none dark:hover:bg-[#27272A]";

export default function SideBar({ position }: { position: string }) {
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);
  const [component, setComponent] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const commonStyle =
    "text-3xl transition delay-80 duration-600 cursor-pointer";

  return (
    <div
      className={`${position} left-0 min-h-screen bg-white/30 backdrop-blur-md shadow-md dark:shadow-none dark:bg-[#18181B]`}
    >
      <div className="grid grid-rows-2 h-screen">
        <HoverCard
          openDelay={150}
          closeDelay={150}
          onOpenChange={() => setComponent(null)}
        >
          <HoverCardContent
            className="rounded-none bg-white/30 backdrop-blur-2xl shadow-md border-none w-[300px] h-screen dark:bg-[#18181B] dark:text-white"
            side="right"
          >
            <SideBarComponentContent component={component} />
          </HoverCardContent>
          <div className="pt-[20px] pb-[50px] w-full flex flex-col">
            <HoverCardTrigger>
              <button
                className={`flex justify-center items-center ${component == "chezz" ? "bg-white/30 backdrop-blur-2xl shadow-md dark:bg-[#27272A]" : ""} my-[5px] h-[50px] w-full`}
                onMouseOver={() => setComponent("chezz")}
              >
                <FaChessBoard
                  className={`${commonStyle} border dark:text-white`}
                />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("playTab")}
                className={`flex justify-center items-center ${component == "playTab" ? "bg-white/30 backdrop-blur-2xl shadow-md dark:bg-[#27272A]" : ""} my-[5px] h-[50px] w-full`}
              >
                <Play
                  className={`${commonStyle} p-1 h-10 w-10 text-green-600`}
                />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("find_users")}
                className={`flex justify-center items-center ${component == "find_users" ? "bg-white/30 backdrop-blur-2xl shadow-md dark:bg-[#27272A]" : ""} my-[5px] h-[50px] w-full`}
              >
                <MdPersonSearch className={`${commonStyle} text-blue-600`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("messages")}
                className={`flex justify-center items-center ${component == "messages" ? "bg-white/30 backdrop-blur-2xl shadow-md dark:bg-[#27272A]" : ""} my-[5px] h-[50px] w-full`}
              >
                <Binoculars className={`${commonStyle} text-yellow-600`} />
              </button>
            </HoverCardTrigger>
          </div>
        </HoverCard>

        <div className="py-[20px] px-[10px] w-full gap-4 flex flex-col justify-end">
          <div
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex justify-center"
          >
            {theme === "dark" ? (
              <Sun className="w-7 h-7 text-white" />
            ) : (
              <Moon className="w-7 h-7" />
            )}
          </div>
          <Link to={"/settings"}>
            <Settings className="w-7 h-7 transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer dark:text-white" />
          </Link>
          {!isGuest && (
            <VscSignOut className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
}

function SideBarComponentContent({ component }: { component: string | null }) {
  if (component === null) return;

  if (component === "chezz") {
    return <ChezzBarContent />;
  }

  if (component === "find_users") {
    return <FindUsersContent />;
  }

  if (component === "messages") {
    return <div></div>;
  }

  if (component === "playTab") {
    return <PlayTabContent />;
  }
}

function ChezzBarContent() {
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  return (
    <div className="my-[20px] px-[5px] flex flex-col gap-4 text-xl">
      <Link
        to={"/home"}
        className={`px-[15px] flex items-center gap-1 text-xl w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <img src="/home.png" className="w-[40px]" />
        Home
      </Link>
      <Link
        to={"/profile"}
        className={`px-[20px] flex items-center gap-2 text-xl w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <img src="/user.png" className="h-[40px] overflow-hidden" />
        Profile
      </Link>
      {!isGuest && (
        <button
          className={`px-[20px] flex items-center gap-2 text-xl w-full h-[40px] rounded-2xl ${hoverEffect} cursor-pointer`}
        >
          <VscSignOut className="text-3xl text-red-400" /> Log Out
        </button>
      )}
    </div>
  );
}

function PlayTabContent() {
  return (
    <div className="my-[20px] px-[5px] flex flex-col gap-4 text-xl">
      <Link
        to={"/play"}
        className={`px-[15px] flex items-center gap-3 text-xl w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <Crown className="w-5 h-5 font-bold overflow-hidden text-yellow-600" />
        New Game
      </Link>
      <Link
        to={"/analyze"}
        className={`pl-[15px] flex items-center gap-3 text-xl w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <Brain className="w-5 h-5 overflow-hidden text-blue-600" />
        Analyze Game
      </Link>
    </div>
  );
}

function FindUsersContent() {
  return (
    <div className="w-full h-[600px] flex flex-col items-center">
      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          placeholder="Search Users"
          className="pl-10 bg-muted/50 outline-1 outline-blue-500  rounded-sm h-[30px]"
        />
      </div>
      <div className="w-full px-[10px] py-[20px]">
        <UserCard username="akhand" rating={800} />
      </div>
    </div>
  );
}

interface UserCardProps {
  username: string;
  rating: number;
  imageUrl?: string;
}

function UserCard({ username, rating, imageUrl }: UserCardProps) {
  return (
    <button className="w-full flex justify-start items-center px-[10px] gap-3 h-8  bg-white/40  hover:bg-transparent hover:border-1 dark:bg-black dark:hover:bg-transparent dark:border-[#27272A] dark:text-white rounded-sm cursor-pointer transition-all duration-600">
      <img
        src={`${imageUrl ?? "/chezz.png"}`}
        alt=""
        className="w-5 h-5 rounded-sm"
      />
      <div className="flex items-center gap-1">
        <div>{username}</div>
        <div className="flex justify-center items-center h-4 px-1 dark:bg-white dark:text-black rounded-xs text-xs">
          {rating}
        </div>
      </div>
    </button>
  );
}
