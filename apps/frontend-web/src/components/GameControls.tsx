import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Share2,
} from "lucide-react";
import MovesTable from "./MovesTable";
import { Button } from "./ui/button";

export default function GameControls() {
  return (
    <div className="h-full pt-1 grid grid-rows-[66%_34%]">
      <div className="flex flex-col">
        <div className="flex w-full justify-center items-center"></div>

        <div className="w-full flex items-center justify-center font-semibold font-dream dark:text-white">
          Moves
        </div>
        <div className="flex-grow overflow-y-auto">
          <MovesTable />
        </div>
        <div className=" flex items-center gap-2 dark:bg-[#7b7b7f] px-2 py-1 bg-white/40 backdrop-blur-lg shadow-xl">
          <button className="w-8 h-8 p-1 hover:cursor-pointer">
            <Share2 className="w-4 h-4 dark:text-white" />
          </button>

          <div className="flex-grow flex justify-end items-center gap-2">
            <Button
              size="icon"
              className="w-8 h-8 bg-white hover:bg-[#E2E2E2]  rounded-xl cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8 stroke-3" />
            </Button>

            <Button
              size="icon"
              className="w-8 h-8 bg-white hover:bg-[#E2E2E2] rounded-xl cursor-pointer"
            >
              <ChevronRight className="w-8 h-8 stroke-3" />
            </Button>

            <Button
              size="icon"
              className="w-8 h-8 bg-white hover:bg-[#E2E2E2] rounded-xl cursor-pointer"
            >
              <RotateCw className="w-8 h-8 stroke-3" />
            </Button>

            <Button
              size="icon"
              className="w-8 h-8 bg-white hover:bg-[#E2E2E2]  rounded-xl cursor-pointer"
            >
              <ArrowUpDown className="w-8 h-8 stroke-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className=" h-full flex flex-col overflow-y-auto">
        <div className="flex-grow"></div>
        <div className="w-full flex items-center border-white/40 border-t-1">
          <input
            type="text"
            placeholder="Send a message...."
            className="w-full h-8 px-2 outline-none text-sm"
          />
        </div>
      </div>
    </div>
  );
}
