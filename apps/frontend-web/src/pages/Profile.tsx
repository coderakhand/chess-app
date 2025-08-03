import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import SideBar from "../components/SideBar";
import { useUserInfoStore } from "../store/atoms";
import { Clock, Zap, Calendar, Star } from "lucide-react";
import GameHistoryOverviewCard from "../components/GameHistoryOverviewCard";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

type TimeControl = "blitz" | "bullet" | "rapid";

export default function Profile() {
  const obj = useParams();
  const username = obj.username || "";
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

  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  const profileStats = profileInfo.user;

  interface recentGamesType {
    id: string;
    opponent: string;
    result: string;
    timeControl: string;
    rating: number;
    moves: number;
    date: string;
  }
  const [recentGames, SetRecentGames] = useState<recentGamesType[]>([]);

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
    };

    fetchGameHistory();
  }, [username]);

  return (
    <div
      className={`flex min-h-screen bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />
      <div className={`sm:pl-[60px] w-full h-full p-4`}>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24 bg-slate-500 text-white/80 ">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback className="text-5xl font-proza">
                      {profileInfo.user.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="ml-8 flex items-center gap-3 mb-2">
                      <h1 className="text-5xl font-bold font-dream">
                        {profileInfo.user.username}
                      </h1>
                      {
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-[#27272A] hover:bg-[#212124] rounded-xl font-semibold text-white"
                        >
                          <Star className="w-3 h-3 fill-yellow-400 stroke-none" />
                          Rising Star
                        </Badge>
                      }
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {profileInfo.user.blitzStats.currentRating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA] font-proza">
                          Blitz
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {profileInfo.user.bulletStats.currentRating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA] font-proza">
                          Bullet
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {profileInfo.user.rapidStats.currentRating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA] font-proza">
                          Rapid
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {profileInfo.user.totalGames}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA]">
                          Total Games
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      disabled={isGuest}
                      className="dark:text-black dark:bg-white dark:hover:bg-[#E2E2E2]"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isGuest}
                      className="dark:border-[#27272A] dark:hover:bg-[#27272A]"
                    >
                      Share Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <div className="flex-grow">
                <Card className="w-full  backdrop-blur-md rounded-xl shadow-xl border-none dark:bg-[#09090B] dark:text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-dream">
                      Game History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 grid">
                      {recentGames.map((game) => (
                        <GameHistoryOverviewCard game={game} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="">
                <Card className="w-[300px] bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                  <CardHeader className="flex flex-col items-center gap-3">
                    <div className="flex gap-4">
                      {(["blitz", "bullet", "rapid"] as TimeControl[]).map(
                        (type) => (
                          <button
                            onClick={() => setSelectedTimeControl(type)}
                            className={` bg-white/40 border-1 border-white/50 ${selectedTimeControl === type ? "border-black" : ""} px-2 rounded-sm capitalize dark:border-[#27272A] dark:bg-[#09090B] dark:text-white`}
                          >
                            {type}
                          </button>
                        )
                      )}
                    </div>
                    <CardTitle className="text-lg capitalize flex items-center gap-2 font-dream">
                      {selectedTimeControl == "blitz" ? (
                        <Clock className="w-5 h-5 text-green-600" />
                      ) : selectedTimeControl == "rapid" ? (
                        <Calendar className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Zap className="w-5 h-5 text-blue-600" />
                      )}
                      {selectedTimeControl} Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="dark:text-[#A1A1AA]">
                        Current Rating
                      </span>
                      <span className="font-bold text-lg">
                        {
                          profileStats[`${selectedTimeControl}Stats`]
                            .currentRating
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-[#A1A1AA]">Peak Rating</span>
                      <span className="font-bold text-green-600">
                        {profileStats[`${selectedTimeControl}Stats`].peakRating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-[#A1A1AA]">Games Played</span>
                      <span className="font-bold">
                        {
                          profileStats[`${selectedTimeControl}Stats`].otherStats
                            .totalGames
                        }
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="dark:text-[#A1A1AA]">Win Rate</span>
                        <span className="font-bold">
                          {
                            profileStats[`${selectedTimeControl}Stats`]
                              .otherStats.winRate
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
                            profileStats[`${selectedTimeControl}Stats`]
                              .otherStats.wins
                          }
                        </div>
                        <div className="dark:text-[#A1A1AA] font-proza">
                          Wins
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-red-600">
                          {
                            profileStats[`${selectedTimeControl}Stats`]
                              .otherStats.losses
                          }
                        </div>
                        <div className="dark:text-[#A1A1AA] font-proza">
                          Losses
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-yellow-600">
                          {
                            profileStats[`${selectedTimeControl}Stats`]
                              .otherStats.draws
                          }
                        </div>
                        <div className="dark:text-[#A1A1AA] font-proza">
                          Draws
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
