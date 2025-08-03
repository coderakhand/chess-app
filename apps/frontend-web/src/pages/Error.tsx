import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function Error() {
  return (
    <div className="min-h-screen min-w-screen flex sm:items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]">
      <SideBar />

      <div className="max-sm:pt-[60px] z-10 min-h-screen min-w-screen flex flex-col gap-3 justify-center items-center bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none">
        <div className="dark:text-white text-6xl font-extrabold font-dream">
          Page Not Found
        </div>
        <div className="dark:text-white text-xl mb-10 font-dream">
          Lets go{" "}
          <Link
            to={"/"}
            className="text-blue-600 hover:text-purple-700 underline underline-offset-2 font-proza"
          >
            back
          </Link>{" "}
          cuz this guy is crazy
        </div>
        <div className="font-proza bg-[url(/background/monster.jpg)] bg-cover h-80 w-100 font-semibold flex justify-center text-xl">
          You found me, I am 404!
        </div>
      </div>
    </div>
  );
}
