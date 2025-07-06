import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useGameInfoStore } from "../store/atoms";

export default function GameResultCard() {
  const result = useGameInfoStore((state) => state.result);
  const [close, setClose] = useState(false);

  if (close) return <></>;

  return (
    <div className="z-100 absolute inset-x-[150px] inset-y-[165px] w-[280px] h-[250px] text-white bg-[#262421] rounded-xl shadow-2xl border border-[#3C3A36]">
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
    </div>
  );
}
