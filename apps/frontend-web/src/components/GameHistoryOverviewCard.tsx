import { BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface RecentGame {
  id: string;
  opponent: string;
  result: string;
  timeControl: string;
  rating: number;
  moves: number;
  date: string;
}

export default function GameHistoryOverviewCard({
  game,
  idx,
}: {
  game: RecentGame;
  idx: number;
}) {
  return (
    <Link to={`/game/${game.id}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 + idx * 0.15, duration: 0.3 }}
        key={game.id}
        className="flex items-center gap-4 px-4 py-2 rounded-lg border hover:border-black hover:bg-muted/50 transition-colors bg-black/30 border-white/30 dark:border-[#27272A]"
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`w-2 h-2 rounded-full ${
              game.result === "win"
                ? "bg-green-500"
                : game.result === "loss"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            }`}
          />
          <Avatar className="flex justify-center items-center w-7 h-7 bg-black text-white dark:bg-white dark:text-black">
            <AvatarFallback className="text-xs">
              {game.opponent[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm font-dream">
              {game.opponent}
            </div>
            <div className="text-xs dark:text-[#A1A1AA] font-proza">
              {game.rating} • {game.moves} moves
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs text-white/60 ${
              game.timeControl === "blitz"
                ? "border-green-500 text-green-700 dark:text-green-400"
                : game.timeControl === "bullet"
                  ? "border-blue-500 text-blue-700 dark:text-blue-400"
                  : "border-purple-500 bg-purple-700 dark:text-purple-400"
            }`}
          >
            {game.timeControl}
          </Badge>
          <Badge
            variant={
              game.result === "win"
                ? "default"
                : game.result === "loss"
                  ? "destructive"
                  : "secondary"
            }
            className={`
                            ${
                              game.result === "win"
                                ? "bg-green-600"
                                : game.result === "loss"
                                  ? "bg-red-500 dark:bg-red-500"
                                  : "bg-yellow-500"
                            } text-white dark:text-[#e7e7ee]`}
          >
            {game.result ?? "live"}
          </Badge>
        </div>

        <div className="text-xs dark:text-[#A1A1AA] font-dream">
          {game.date}
        </div>

        <Button variant="ghost" size="sm">
          <BarChart3 className="w-4 h-4" />
        </Button>
      </motion.div>
    </Link>
  );
}
