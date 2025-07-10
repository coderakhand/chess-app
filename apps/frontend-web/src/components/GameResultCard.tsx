import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useGameInfoStore } from "../store/atoms";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function GameResultCard() {
  const [close, setClose] = useState(false);

  if (close) return <></>;

  return <CelebrationCard setClose={setClose} />;
}

interface CelebrationCardProps {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

function CelebrationCard({ setClose }: CelebrationCardProps) {
  const result = useGameInfoStore((state) => state.result);
  const color = useGameInfoStore((state) => state.color);

  useEffect(() => {
    if (!result.winner || result.winner !== color) return;
    confetti({
      particleCount: 200,
      spread: 50,
      origin: {
        x: 0.35,
        y: 0.5,
      },
      ticks: 260,
    });
  });
  return (
    <motion.div
      initial={{ scaleY: 0, scaleX: 0 }}
      animate={{ scaleY: 1, scaleX: 1 }}
      transition={{ delay: 0.4, duration: 1.3, ease: "backInOut" }}
      className="absolute w-full h-full flex justify-center items-center"
    >
      <div
        className={`${color === "b" ? "rotate-180" : ""} z-100 absolute inset-x-auto inset-y-auto w-[260px] h-[200px] text-white bg-[#262421] rounded-xl shadow-2xl border border-[#3C3A36] flex flex-col`}
      >
        <RxCross2
          onClick={() => setClose(true)}
          className="absolute top-[5px] right-[3px] rounded-full text-xl text-white cursor-pointer"
        />
        <div className="flex flex-col justify-center items-center bg-[#3C3A36] h-[80px] rounded-t-xl">
          <div className="text-3xl font-bold">
            {result.winner
              ? result.winner === "w"
                ? "White Wins"
                : "Black Wins"
              : "Draw"}
          </div>
          <div className="text-sm">{result.reason}</div>
        </div>
        <div className="grid grid-cols-2 w-full h-full justify-center items-end gap-2 py-5 px-3">
          <button className="p-1 text-white bg-[#8CA2AD] dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer rounded-sm">
            New Game
          </button>
          <button className="p-1 text-white bg-[#8CA2AD] dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer rounded-sm">
            Rematch
          </button>
        </div>
      </div>
    </motion.div>
  );
}
