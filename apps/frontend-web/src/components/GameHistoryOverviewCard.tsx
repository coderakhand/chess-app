import { BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
}: {
  game: RecentGame;
}) {
  return (
    <Link to={`/game/${game.id}`}>
      <div
        key={game.id}
        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors border-white/40 dark:border-[#27272A]"
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`w-3 h-3 rounded-full ${
              game.result === "win"
                ? "bg-green-500"
                : game.result === "loss"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            }`}
          />
          <Avatar className="flex justify-center items-center w-8 h-8 bg-black text-white dark:bg-white dark:text-black">
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
            className={`text-xs ${
              game.timeControl === "blitz"
                ? "border-green-500 text-green-700 dark:text-green-400"
                : game.timeControl === "bullet"
                  ? "border-blue-500 text-blue-700 dark:text-blue-400"
                  : "border-purple-500 text-purple-700 dark:text-purple-400"
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
      </div>
    </Link>
  );
}
