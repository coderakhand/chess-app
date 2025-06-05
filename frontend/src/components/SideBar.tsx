import { FaChessBoard } from "react-icons/fa";
import { MdPersonSearch, MdOutlineMail } from "react-icons/md";
import { AiTwotoneSetting } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaHome, FaUser } from "react-icons/fa";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { useState } from "react";

export default function SideBar() {
  const [component, setComponent] = useState<string | null>(null);

  const commonStyle =
    "text-3xl transition delay-80 duration-600 cursor-pointer";

  const hoverEffect =
    " hover:bg-white/30 hover:backdrop-blur-2xl hover:shadow-md";

  return (
    <div className="fixed left-0 min-h-screen bg-white/30 backdrop-blur-md shadow-md">
      <div className="grid grid-rows-2 h-screen">
        <HoverCard>
          <HoverCardContent
            className="rounded-none bg-white/30 backdrop-blur-2xl shadow-md border-none w-[300px] h-screen"
            side="right"
          >
            <SideBarComponentContent component={component} />
          </HoverCardContent>
          <div className="py-[50px] w-full flex flex-col">
            <HoverCardTrigger>
              <button
                className={`flex justify-center items-center ${hoverEffect} my-[5px] h-[50px] w-full`}
                onMouseOver={() => setComponent("chezz")}
              >
                <FaChessBoard className={`${commonStyle} border`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("find")}
                className={`flex justify-center items-center ${hoverEffect} my-[5px] h-[50px] w-full`}
              >
                <MdPersonSearch className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("messages")}
                className={`flex justify-center items-center ${hoverEffect} my-[5px] h-[50px] w-full`}
              >
                <MdOutlineMail className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>

            <HoverCardTrigger>
              <button
                onMouseOver={() => setComponent("news")}
                className={`flex justify-center items-center ${hoverEffect} my-[5px] h-[50px] w-full`}
              >
                <IoNewspaperOutline className={`${commonStyle}`} />
              </button>
            </HoverCardTrigger>
          </div>
        </HoverCard>

        <div className="py-[20px] px-[10px] w-full gap-3 flex flex-col justify-end">
          <AiTwotoneSetting className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
          <VscSignOut className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

function SideBarComponentContent({ component }: { component: string | null }) {
  if (component === null) return;

  if (component === "chezz") {
    return (
      <div className="my-[20px] px-[10px] flex flex-col gap-4 text-xl">
        <a href={"/home"} className="flex gap-2 text-xl">
          <FaHome className="text-2xl" />
          Home
        </a>
        <a href={"/profile"} className="flex gap-2 text-xl">
          <FaUser className="text-2xl" />
          Profile
        </a>
        <div className="flex gap-2 text-xl">
          <VscSignOut className="text-3xl" /> Log Out
        </div>
      </div>
    );
  }

  if (component === "find") {
    return <div></div>;
  }

  if (component === "messages") {
    return <div></div>;
  }

  if (component === "news") {
    return <div></div>;
  }
}
