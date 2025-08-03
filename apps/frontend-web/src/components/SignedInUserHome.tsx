import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import SideBar from "./SideBar";
import {
  Play,
  Users,
  BarChart3,
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  Trophy,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import GameHistoryOverviewCard from "./GameHistoryOverviewCard";
import axios from "axios";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";

type TimeControl = "blitz" | "bullet" | "rapid";

export default function SignedInUserHome() {
  const { user } = useAuth();
  const [selectedTimeControl, setSelectedTimeControl] =
    useState<TimeControl>("blitz");

  interface recentGamesType {
    id: string;
    opponent: string;
    result: string;
    timeControl: string;
    rating: number;
    moves: number;
    date: string;
  }

  const quickPlayOptions = [
    {
      title: "New Game",
      link: "/play",
      description: "Play with someone random",
      icon: Play,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Play a Friend",
      link: "/play",
      description: "Challenge your friends",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Analyze Games",
      link: "/analyze",
      description: "Review your recent games",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const [recentGames, SetRecentGames] = useState<recentGamesType[]>([]);

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
    };

    fetchGameHistory();
  }, [user.username]);

  return (
    <div
      className={`flex min-h-screen bg-[url(/background/bg-1.jpg)] bg-opacity-60 bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />
      <div className="flex justify-center items-center min-h-screen min-w-screen">
        <div className="flex justify-center items-center max-w-5xl flex-grow">
          <div className="ml-[40px] flex-1 p-6">
            <div className="w-full h-[150px] bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 text-center text-white">
                <h1 className="text-4xl font-bold mb-2 font-dream">
                  Welcome back, {user.username}!
                </h1>
                <p className="font-proza font-medium text-lg opacity-90 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                  Ready to play some chess?
                </p>
              </div>
              <div className="absolute top-4 right-6 text-white font-dream">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 dark:bg-[#27272A] dark:hover:bg-[#212124] dark:text-[#A1A1AA]"
                >
                  <Trophy className="w-3 h-3 mr-1 text-yellow-400" />
                  Rank {8000}
                </Badge>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mb-6  p-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium font-dream">
                      Rapid
                    </span>
                  </div>
                  <div className="text-2xl font-bold dark:text-[#A1A1AA]">
                    {user.ratings?.rapid}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium font-dream">
                      Blitz
                    </span>
                  </div>
                  <div className="text-2xl font-bold dark:text-[#A1A1AA]">
                    {user.ratings?.blitz}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium font-dream">
                      Bullet
                    </span>
                  </div>
                  <div className="text-2xl font-bold dark:text-[#A1A1AA]">
                    {user.ratings?.bullet}
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-proza"
              >
                <TrendingUp className="w-3 h-3" />
                +25 this week
              </Badge>
            </div>

            <div className="flex gap-6 mb-6">
              <Card className="w-[300px] bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:border-[#27272A] dark:bg-[#09090B]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white font-dream">
                    <Play className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickPlayOptions.map((option, index) => (
                    <Button
                      key={index}
                      className={`w-full justify-start h-auto p-4 ${option.color}`}
                    >
                      <Link to={option.link}>
                        <div className="flex items-center gap-3 w-full">
                          <option.icon className="w-5 h-5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium font-dream">
                              {option.title}
                            </div>
                            <div className="text-sm opacity-90 font-proza">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="flex-1 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Rating Progress
                    <div className="flex gap-2">
                      {(["rapid", "blitz", "bullet"] as TimeControl[]).map(
                        (type) => (
                          <Button
                            key={type}
                            variant={
                              selectedTimeControl === type
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTimeControl(type)}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        )
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>
            </div>

            <Card className="w-full bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-dream">
                  Recent Games
                  <Link to={`/player/${user.username}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:border-[#27272A] dark:hover:bg-[#27272A]"
                    >
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 grid gap-1">
                  {recentGames.map((game) => (
                    <GameHistoryOverviewCard game={game} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
