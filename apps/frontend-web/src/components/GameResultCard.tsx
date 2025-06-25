import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

export default function GameResultCard({ winner }: { winner: string }) {
  const [close, setClose] = useState(false);
  if (close) return <></>;
  return (
    <div className="absolute inset-x-[150px] inset-y-[165px] w-[280px] h-[250px] text-white bg-[#262421] rounded-xl shadow-2xl border border-[#3C3A36]">
      <RxCross2
        onClick={() => setClose(true)}
        className="absolute top-[5px] right-[3px] rounded-full text-xl text-white cursor-pointer"
      />
      <div className="flex flex-col justify-center items-center bg-[#3C3A36] h-[80px] rounded-t-xl">
        <div className="text-3xl font-bold">
          {winner === "w" ? "White Wins" : "Black Wins"}
        </div>
        <div className="text-sm">By CheckMate</div>
      </div>
    </div>
  );
}