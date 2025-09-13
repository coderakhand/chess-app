import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useGameInfoStore } from "../store/atoms";
import { motion } from "motion/react";
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
  const flipBoard = useGameInfoStore((state) => state.flipBoard);

  useEffect(() => {
    if (!result.winner || result.winner !== color) return;
    confetti({
      particleCount: 100,
      spread: 50,
      origin: {
        x: 0.35,
        y: 0.5,
      },
      ticks: 260,
    });
  }, [result.winner]);

  return (
    <motion.div
      initial={{ scaleY: 0, scaleX: 0 }}
      animate={{ scaleY: 1, scaleX: 1 }}
      transition={{ delay: 0.4, duration: 1.3, ease: "backInOut" }}
      className="absolute w-full h-full flex justify-center items-center"
    >
      <div
        className={`${flipBoard ? "rotate-180" : ""} z-100 absolute inset-x-auto inset-y-auto w-[260px] h-[160px] dark:text-white bg-white/40 backdrop-blur-xs dark:bg-[#262421] rounded-xl shadow-2xl border border-white/50 dark:border-[#3C3A36] flex flex-col`}
      >
        <RxCross2
          onClick={() => setClose(true)}
          className="absolute top-[5px] right-[3px] rounded-full text-xl text-black dark:text-white cursor-pointer z-10"
        />
        <div className="flex flex-col justify-center items-center bg-white/30 backdrop-blur-sm dark:bg-[#3C3A36] h-[80px] rounded-t-xl">
          <div className="text-3xl font-bold">
            {result.winner
              ? result.winner === "w"
                ? "White Wins"
                : "Black Wins"
              : "Draw"}
          </div>
          <div className="text-sm">{result.reason}</div>
        </div>
        <div className="w-full h-full flex justify-center items-end py-5 px-3">
          <button className="p-1 text-white font-proza  font-bold text-xl bg-[#8CA2AD] hover:brightness-95 cursor-pointer rounded-sm w-full">
            Analyze
          </button>
        </div>
      </div>
    </motion.div>
  );
}
