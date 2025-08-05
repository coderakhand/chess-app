import { FaChessBoard } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useEffect, useState } from "react";
import {
  Brain,
  Crown,
  History,
  Moon,
  Play,
  Search,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Settings } from "lucide-react";
import { useUserInfoStore } from "../store/atoms";
import api from "../api/axios";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { FaRankingStar } from "react-icons/fa6";

const hoverEffect =
  " hover:bg-white/30 hover:backdrop-blur-2xl hover:shadow-md  dark:hover:shadow-none dark:hover:bg-[#27272A]";

export default function SideBar() {
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);
  const [component, setComponent] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const commonStyle =
    "text-3xl transition delay-80 duration-600 cursor-pointer";
  const [isToggling, setIsToggling] = useState(false);

  return (
    <div
      className={`absolute w-screen sm:w-[48px] z-100 bg-white/30 backdrop-blur-md shadow-md dark:shadow-none dark:bg-[#18181B] overflow-hidden`}
    >
      <div className="flex sm:grid sm:grid-rows-2 sm:h-screen">
        <HoverCard
          openDelay={150}
          closeDelay={150}
          onOpenChange={() => setComponent(null)}
        >
          <HoverCardContent
            className="z-1000 rounded-none bg-white/30 backdrop-blur-2xl shadow-md border-none w-screen sm:w-[300px] sm:h-screen dark:bg-[#18181B] dark:text-white font-dream"
            side={window.innerWidth < 640 ? "bottom" : "left"}
          >
            <SideBarComponentContent component={component} />
          </HoverCardContent>
          <div className="sm:pt-[20px] sm:pb-[50px] w-full flex sm:flex-col max-sm:gap-4 max-sm:pl-4">
            <HoverCardTrigger>
              <button
                className={`flex justify-center items-center ${component == "chezz" ? "sm:bg-white/30 sm:backdrop-blur-2xl sm:shadow-md sm:dark:bg-[#27272A]" : ""} my-[5px] h-[30px] xsm:h-[40px] sm:h-[50px] w-full`}
                onMouseOver={() => setComponent("chezz")}
                onTouchEnd={() => setComponent("chezz")}
              >
                <FaChessBoard
                  className={`${commonStyle} border dark:text-white`}
                />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("playTab")}
                onTouchEnd={() => setComponent("playTab")}
                className={`flex justify-center items-center ${component == "playTab" ? "sm:bg-white/30 sm:backdrop-blur-2xl sm:shadow-md sm:dark:bg-[#27272A]" : ""} my-[5px] h-[30px] xsm:h-[40px] sm:h-[50px] w-full`}
              >
                <Play
                  className={`${commonStyle} p-1 h-10 w-10 text-green-600`}
                />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("rankings")}
                onTouchEnd={() => setComponent("rankings")}
                className={`flex justify-center items-center ${component == "rankings" ? "sm:bg-white/30 sm:backdrop-blur-2xl sm:shadow-md sm:dark:bg-[#27272A]" : ""} my-[5px] h-[30px] xsm:h-[40px] sm:h-[50px] w-full`}
              >
                <TrendingUp className={`${commonStyle} text-purple-600`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("find_users")}
                onTouchEnd={() => setComponent("find_users")}
                className={`flex justify-center items-center ${component == "find_users" ? "sm:bg-white/30 sm:backdrop-blur-2xl sm:shadow-md sm:dark:bg-[#27272A]" : ""} my-[5px] h-[30px] xsm:h-[40px] sm:h-[50px] w-full`}
              >
                <MdPersonSearch className={`${commonStyle} text-blue-600`} />
              </button>
            </HoverCardTrigger>
          </div>
        </HoverCard>

        <div className="sm:py-[20px] px-2 xsmd:px-[10px] w-full gap-2 xsmd:gap-4 flex max-sm:items-center sm:flex-col justify-end">
          {isGuest && (
            <Button
              className={`shrink-0 sm:hidden relative w-16 xsm:w-20  ${theme === "light" ? "bg-[#272730] text-white hover:text-black hover:border-2" : ""} dark:bg-green-600 dark:hover:bg-green-700 duration-400 transition-normal ease-out cursor-pointer`}
            >
              <div className="absolute -top-2 w-full h-2 blur-md dark:bg-green-700" />
              <div className="absolute -right-2 w-2 h-full blur-md dark:bg-green-700" />
              <div className="absolute -left-2 w-2 h-full blur-md dark:bg-green-700" />
              <div className="absolute -bottom-2 w-full h-2 blur-md dark:bg-green-700" />
              <Link
                to="/play"
                className="flex justify-center items-center xsm:text-lg rounded-xl flex-wrap font-dream font-semibold"
              >
                Log In
              </Link>
            </Button>
          )}
          <motion.div
            onClick={() => {
              if (isToggling) return;
              setIsToggling(true);

              setTimeout(() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setIsToggling(false);
              }, 400);
            }}
            whileTap={{ scale: 0.8, rotate: 360 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="flex justify-center max-xsmd:hidden cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6 xsm:w-7 xsm:h-7  stroke-white fill-white" />
            ) : (
              <Moon className="w-6 h-6 xsm:w-7 xsm:h-7 fill-black" />
            )}
          </motion.div>
          <Link to={"/settings"}>
            <Settings className="text-amber-100 max-xsm:hidden w-6 h-6 xsm:w-7 xsm:h-7 cursor-pointer " />
          </Link>
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

  if (component === "rankings") {
    return (
      <div className="my-[20px] px-[5px] flex flex-col gap-4 text-xl">
        <Link
          to={"/fide/ratings"}
          className={`px-[20px] flex items-center gap-2.5 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
        >
          <FaRankingStar className="text-yellow-600 w-5 h-5" />
          <p className="h-full flex items-center py-1">Chess Rankings </p>
        </Link>
        <Link
          to={`/games/history`}
          className={`px-[20px] flex items-center gap-2 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
        >
          <History className="text-slate-700" />
          <p className="h-full flex items-center py-1">Game History</p>
        </Link>
      </div>
    );
  }

  if (component === "playTab") {
    return <PlayTabContent />;
  }
}

function ChezzBarContent() {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const navigate = useNavigate();
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
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="my-[20px] px-[5px] flex flex-col gap-4 text-xl">
      <Link
        to={"/home"}
        className={`px-[15px] flex items-center gap-1 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <img src="/home.png" className="w-[40px]" />
        <p className="h-full flex items-center py-1">Home </p>
      </Link>
      {/* <Link
        to={`/player/${userInfo.username}`}
        className={`px-[20px] flex items-center gap-2 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <img src="/user.png" className="h-[40px] overflow-hidden" />
        <p className="h-full flex items-center py-1">Profile</p>
      </Link> */}
      {!userInfo.isGuest && (
        <button
          className={`px-[20px] flex items-center gap-2 text-xl w-full h-[40px] rounded-2xl ${hoverEffect} cursor-pointer`}
          onClick={userLogout}
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
        className={`px-[15px] flex items-center gap-3 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <Crown className="w-5 h-5 font-bold overflow-hidden text-yellow-600" />
        New Game
      </Link>
      <Link
        to={"/analyze"}
        className={`pl-[15px] flex items-center gap-3 text-lg font-bold font-proza w-full h-[40px] rounded-2xl ${hoverEffect}`}
      >
        <Brain className="w-5 h-5 overflow-hidden text-blue-600" />
        Analyze Game
      </Link>
    </div>
  );
}

function FindUsersContent() {
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {});
  return (
    <div className="w-full h-[300px] flex flex-col items-center">
      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          placeholder="Search Users"
          className="pl-10 bg-muted/50 outline-1 outline-blue-500  rounded-sm h-[30px]"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
          }}
        />
      </div>
      <div className="w-full px-[10px] py-[20px]">
        {searchUser !== "" ? (
          <div className="w-full flex justify-center">No User Found</div>
        ) : (
          <UserCard username="akhand" rating={800} />
        )}
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
    <Link
      to={`/player/${username}`}
      className="w-full flex justify-start items-center px-[10px] gap-3 h-8  bg-white/40  hover:bg-transparent border-[0.5px] dark:bg-black dark:hover:bg-transparent dark:border-[#27272A] dark:text-white rounded-sm cursor-pointer transition-all duration-600"
    >
      <img
        src={`${imageUrl ?? "/chezz.png"}`}
        alt=""
        className="w-5 h-5 rounded-sm"
      />
      <div className="flex items-center gap-1">
        <div>{username}</div>
        <div className="flex justify-center items-center h-4 px-1 bg-[#27272A] text-[#A1A1AA] rounded-xs text-xs">
          {rating}
        </div>
      </div>
    </Link>
  );
}
