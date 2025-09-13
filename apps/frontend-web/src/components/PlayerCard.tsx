import { motion } from "motion/react";

export default function PlayerCard({
  player,
  color,
  rating,
  time,
  imageUrl,
  title,
}: {
  player: string;
  color: string;
  rating?: number;
  time?: number | null;
  imageUrl?: string;
  title?: string;
}) {
  function formatTime(time: number | null) {
    if (time === null) return "3:00";
    const totalSeconds = Math.ceil(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div className="flex items-center w-full h-[40px]">
      <div className=" flex-grow px-[5px] h-full flex items-center gap-2">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          exit={{ opacity: 0 }}
          src={`${imageUrl ?? "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9"}`}
          alt=""
          className="w-[36px] rounded-sm"
        />
        {title && (
          <div
            className={`flex justify-center items-center bg-[#7B2929] h-4 rounded-xs`}
          >
            <p className="text-white text-xs p-0.5">{title}</p>
          </div>
        )}
        <div className={`dark:text-white font-dream font-semibold`}>
          {player}{" "}
        </div>
        <div
          className={`text-xs px-1 rounded-sm bg-[#27272A] text-[#A1A1AA] font-proza`}
        >
          {rating}
        </div>
      </div>
      {time != null && (
        <div
          className={`flex justify-end items-center px-[5px] h-[40px] w-[120px] ${color === "b" ? "text-white bg-black dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A]" : "text-black bg-white"} rounded-lg text-3xl`}
        >
          {formatTime(time)}
        </div>
      )}
    </div>
  );
}
