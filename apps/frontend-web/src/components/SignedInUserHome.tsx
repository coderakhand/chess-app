import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { Clock, Zap, Calendar } from "lucide-react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@radix-ui/react-progress";
import GameHistoryOverviewCard from "./GameHistoryOverviewCard";
import { useParams } from "react-router-dom";
import { recentGamesType } from "../config";

type TimeControl = "blitz" | "bullet" | "rapid";

export default function SignedInUserHome() {
  const { user } = useAuth();
  const obj = useParams();
  const username = obj.username || user.username;
  const [selectedTimeControl, setSelectedTimeControl] =
    useState<TimeControl>("blitz");

  const [profileInfo, SetProfileInfo] = useState({
    user: {
      username: "Guest",
      totalGames: 0,
      blitzStats: {
        currentRating: 800,
        peakRating: 800,
        otherStats: {
          draws: 0,
          losses: 0,
          ratingHistory: [],
          totalGames: 0,
          winRate: 0,
          wins: 0,
        },
      },
      bulletStats: {
        currentRating: 800,
        peakRating: 800,
        otherStats: {
          draws: 0,
          losses: 0,
          ratingHistory: [],
          totalGames: 0,
          winRate: 0,
          wins: 0,
        },
      },
      rapidStats: {
        currentRating: 800,
        peakRating: 800,
        otherStats: {
          draws: 0,
          losses: 0,
          ratingHistory: [],
          totalGames: 0,
          winRate: 0,
          wins: 0,
        },
      },
    },
  });

  const userStats = {
    blitz: {
      rating: 1245,
      peak: 1320,
      games: 156,
      wins: 89,
      losses: 52,
      draws: 15,
    },
    bullet: {
      rating: 1180,
      peak: 1250,
      games: 203,
      wins: 112,
      losses: 78,
      draws: 13,
    },
    rapid: {
      rating: 1290,
      peak: 1350,
      games: 87,
      wins: 52,
      losses: 28,
      draws: 7,
    },
  };

  const currentStats = userStats[selectedTimeControl];
  const winRate = Math.round((currentStats.wins / currentStats.games) * 100);

  const profileStats = profileInfo.user;

  const [recentGames, SetRecentGames] = useState<recentGamesType[]>([]);
  const [IsLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/user/profile/${username}`);
        const data = response.data;
        SetProfileInfo(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const { data: csrf } = await api.get("/csrf-token");

        const response = await axios.post(
          `http://localhost:3000/user/games/${username}`,
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
  }, [username]);

  // const avatars = ["Amaya", "Destiny", "Leah", "Andrea", "Nolan", "Sarah"];

  return (
    <div
      className={`flex  min-h-screen bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />
      <div className=" bg-black/10 sm:pl-[50px] flex justify-center min-h-screen w-full">
        <div className="max-w-[1600px] lg:px-12 lg:py-10 flex w-full h-full">
          <div className="w-full flex flex-col gap-6">
            <div className="flex w-full gap-4">
              <div className="flex-grow flex justify-start gap-12 bg-black/30   dark:border-[#27272A] dark:bg-[#09090B] rounded-xl py-4 px-6 dark:text-white">
                <div className="flex justify-start items-center gap-3">
                  <img
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=Andrea"
                    alt=""
                    className="h-40 w-40 bg-black/30 dark:bg-white rounded-full overflow-hidden"
                  />
                  <div className="px-2">
                    <h1 className="text-3xl text-white font-proza">
                      {username}
                    </h1>
                    <p className="font-dream text-sm font-semibold">
                      Last Login: {"3 days ago"}
                    </p>
                  </div>
                </div>
                <div className=" bg-black/60 dark:bg-white/80 w-1 rounded-full" />
                <div className="flex flex-col justify-center gap-4 flex-grow">
                  <h1 className="font-bold text-2xl">Ratings</h1>
                  <div className="grid grid-rows-3 gap-1 font-proza dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 font-extrabold font-proza text-lg">
                        <Zap className="w-6 h-6 text-blue-600" />
                        <p>Bullet:</p>
                      </div>
                      <div>{profileStats.bulletStats.currentRating}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 font-extrabold font-proza text-lg">
                        <Clock className="w-6 h-6 text-green-600" />
                        <p>Blitz:</p>
                      </div>
                      <div>{profileStats.blitzStats.currentRating}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 font-bold font-proza text-lg">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <p className="">Rapid:</p>
                      </div>
                      <div>{profileStats.rapidStats.currentRating}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:max-h-[350px] sm:w-[300px] sm:p-[20px] rounded-xl bg-black/30  dark:border-[#27272A]  dark:bg-[#09090B] text-white">
                <h2 className="font-bold text-lg text-black dark:text-white">
                  Friends:
                </h2>
                <div></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                <div className="py-4 px-4 w-full bg-black/30 backdrop-blur-md rounded-xl shadow-xl  dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
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

              <div className="sm:max-h-[350px] sm:w-[300px] sm:p-[20px] rounded-xl bg-black/30  dark:border-[#27272A]  dark:bg-[#09090B] text-white">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-4">
                    {(["blitz", "bullet", "rapid"] as TimeControl[]).map(
                      (type) => (
                        <button
                          onClick={() => setSelectedTimeControl(type)}
                          className={`cursor-pointer text-sm  bg-black/40  border-1 ${selectedTimeControl == type ? "text-white  border-white dark:border-white" : "text-[#A1A1A1]  dark:border-[#27272A]"} px-2 rounded-sm capitalize dark:bg-[#09090B] dark:text-white`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                  <div className="mb-4 text-lg capitalize flex items-center gap-2 font-dream text-white font-bold">
                    {selectedTimeControl == "blitz" ? (
                      <Clock className="w-6 h-6 text-green-600" />
                    ) : selectedTimeControl == "rapid" ? (
                      <Calendar className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Zap className="w-6 h-6 text-blue-600" />
                    )}
                    {selectedTimeControl} Stats
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">Current Rating</span>
                    <span className="font-bold text-lg">
                      {
                        profileStats[`${selectedTimeControl}Stats`]
                          .currentRating
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">Peak Rating</span>
                    <span className="font-bold text-green-600">
                      {profileStats[`${selectedTimeControl}Stats`].peakRating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">Games Played</span>
                    <span className="font-bold">
                      {
                        profileStats[`${selectedTimeControl}Stats`].otherStats
                          .totalGames
                      }
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Win Rate</span>
                      <span className="font-bold">
                        {
                          profileStats[`${selectedTimeControl}Stats`].otherStats
                            .winRate
                        }
                        %
                      </span>
                    </div>
                    <Progress value={winRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-bold text-green-600">
                        {
                          profileStats[`${selectedTimeControl}Stats`].otherStats
                            .wins
                        }
                      </div>
                      <div className="dark:text-[#A1A1AA] font-proza">Wins</div>
                    </div>
                    <div>
                      <div className="font-bold text-red-600">
                        {
                          profileStats[`${selectedTimeControl}Stats`].otherStats
                            .losses
                        }
                      </div>
                      <div className="dark:text-[#A1A1AA] font-proza">
                        Losses
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-yellow-600">
                        {
                          profileStats[`${selectedTimeControl}Stats`].otherStats
                            .draws
                        }
                      </div>
                      <div className="dark:text-[#A1A1AA] font-proza">
                        Draws
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
