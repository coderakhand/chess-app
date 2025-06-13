import { FaChessBoard } from "react-icons/fa";
import { MdPersonSearch, MdOutlineMail } from "react-icons/md";
import { AiTwotoneSetting } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { IoNewspaperOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useState } from "react";

const hoverEffect =
  " hover:bg-white/30 hover:backdrop-blur-2xl hover:shadow-md";

export default function SideBar({ position }: { position: string }) {
  const [component, setComponent] = useState<string | null>(null);

  const commonStyle =
    "text-3xl transition delay-80 duration-600 cursor-pointer";

  return (
    <div
      className={`${position} left-0 min-h-screen bg-white/30 backdrop-blur-md shadow-md`}
    >
      <div className="grid grid-rows-2 h-screen">
        <HoverCard
          openDelay={150}
          closeDelay={150}
          onOpenChange={() => setComponent(null)}
        >
          <HoverCardContent
            className="rounded-none bg-white/30 backdrop-blur-2xl shadow-md border-none w-[300px] h-screen"
            side="right"
          >
            <SideBarComponentContent component={component} />
          </HoverCardContent>
          <div className="py-[50px] w-full flex flex-col">
            <HoverCardTrigger>
              <button
                className={`flex justify-center items-center ${component == "chezz" ? "bg-white/30 backdrop-blur-2xl shadow-md" : ""} my-[5px] h-[50px] w-full`}
                onMouseOver={() => setComponent("chezz")}
              >
                <FaChessBoard className={`${commonStyle} border`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("find_users")}
                className={`flex justify-center items-center ${component == "find_users" ? "bg-white/30 backdrop-blur-2xl shadow-md" : ""} my-[5px] h-[50px] w-full`}
              >
                <MdPersonSearch className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("messages")}
                className={`flex justify-center items-center ${component == "messages" ? "bg-white/30 backdrop-blur-2xl shadow-md" : ""} my-[5px] h-[50px] w-full`}
              >
                <MdOutlineMail className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("news")}
                className={`flex justify-center items-center ${component == "news" ? "bg-white/30 backdrop-blur-2xl shadow-md" : ""} my-[5px] h-[50px] w-full`}
              >
                <IoNewspaperOutline className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>
          </div>
        </HoverCard>

        <div className="py-[20px] px-[10px] w-full gap-3 flex flex-col justify-end">
          <Link to={"/settings"}>
            <AiTwotoneSetting className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
          </Link>
          <VscSignOut className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
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

  if (component === "news") {
    return <div></div>;
  }
}

function ChezzBarContent() {
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
      <button
        className={`px-[20px] flex items-center gap-2 text-xl w-full h-[40px] rounded-2xl ${hoverEffect} cursor-pointer`}
      >
        <VscSignOut className="text-3xl" /> Log Out
      </button>
    </div>
  );
}

function FindUsersContent() {
  return (
    <div>
      <div>
        <input type="text" placeholder="search username" />
      </div>
      <div>
        <div>user1</div>
        <div>user2</div>
        <div>user3</div>
      </div>
    </div>
  );
}
