import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { recentGamesType } from "../config";
import axios from "axios";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import useAuth from "../hooks/useAuth";
import GameHistoryOverviewCard from "../components/GameHistoryOverviewCard";

export default function GameHistory() {
  const { user } = useAuth();
  const [recentGames, SetRecentGames] = useState<recentGamesType[]>([]);
  const [IsLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const { data: csrf } = await api.get("/csrf-token");

        const response = await axios.post(
          `http://localhost:3000/user/games/${user.username}`,
          { offset: recentGames.length },
          {
            headers: { "csrf-token": csrf.csrfToken },
          }
        );

        const data = response.data;

        const games = data.games.map((game: recentGamesType) => ({
          ...game,
          date: formatDistanceToNow(new Date(game.date), { addSuffix: true }),
        }));

        SetRecentGames(games);
        console.log(data);
      } catch (e) {
        console.error("Error fetching game history:", e);
      }
      setIsLoadingGames(false);
    };
    fetchGameHistory();
  }, []);

  return (
    <div
      className={`flex max-lg:flex-col w-screen lg:h-screen  lg:gap-[100px] bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />

      <div className="bg-black/10 flex max-lg:flex-col  max-lg:items-center justify-center w-screen min-h-screen py-[30px] gap-6 sm:pl-[60px] px-1 max-sm:px-3 max-sm:pt-[100px]">
        <div className="flex justify-center px-20 w-full ">
          <div className="flex flex-col sm:gap-3 py-4 px-4 w-full  dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
            <div className="px-2 py-2 flex items-center justify-between font-dream font-bold text-xl">
              Game History
            </div>
            <div>
              {IsLoadingGames ? (
                <div className="font-proza flex w-full justify-center">
                  Loading Games...
                </div>
              ) : recentGames.length == 0 ? (
                <div className="font-proza flex w-full justify-center">
                  No Games Found
                </div>
              ) : (
                <div className="space-y-3 grid">
                  {recentGames.map((game, idx) => (
                    <GameHistoryOverviewCard game={game} idx={idx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
