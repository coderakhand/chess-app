import { FaChessBoard } from "react-icons/fa";
import { MdPersonSearch, MdOutlineMail } from "react-icons/md";
import { TbUserCircle } from "react-icons/tb";
import { AiTwotoneSetting } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";

export default function SideBar() {
  const commonStyle =
    "w-full text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer";
  return (
    <div className="grid grid-rows-2 sticky left-0 h-screen w-[100px]  bg-white/30 backdrop-blur-md shadow-md">
      <div className="py-[50px] px-[10px] w-full flex flex-col gap-6">
        {/* play */}
        <FaChessBoard className={`${commonStyle} border`} />
        {/* find user */}
        <MdPersonSearch className={`${commonStyle}`} />
        {/* {message} */}
        <MdOutlineMail className={commonStyle} />
        {/* Profile */}
        <TbUserCircle className={`${commonStyle}`} />
      </div>

      <div className="py-[20px] px-[10px] w-full gap-3 flex flex-col justify-end">
        <AiTwotoneSetting className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
        <VscSignOut className="text-3xl transition delay-80 duration-600 hover:ease-out hover:scale-110 cursor-pointer" />
      </div>
    </div>
  );
}
