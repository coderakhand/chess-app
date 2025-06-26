import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import SideBar from "../components/SideBar";
import { useBgImageStore, useUserInfoStore } from "../store/atoms";
import { RatingChart } from "../components/RatingChart";
// import { GameHistory } from "./GameHistory";
import {
  Trophy,
  Target,
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  Star,
  Crown,
} from "lucide-react";

type TimeControl = "blitz" | "bullet" | "rapid";

export default function Profile() {
  const bgImage = useBgImageStore((state) => state.bgImage);
  const [selectedTimeControl, setSelectedTimeControl] =
    useState<TimeControl>("blitz");

  // Mock user data
  const user = {
    username: "ChessPlayer",
    avatar: "/placeholder.svg?height=96&width=96",
    isPremium: true,
  };

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

  const achievements = [
    {
      name: "First Win",
      description: "Won your first game",
      icon: Trophy,
      earned: true,
    },
    {
      name: "Speed Demon",
      description: "Won 10 bullet games",
      icon: Zap,
      earned: true,
    },
    {
      name: "Tactician",
      description: "Solved 50 puzzles",
      icon: Target,
      earned: true,
    },
    {
      name: "Marathon Player",
      description: "Played 100 games",
      icon: Clock,
      earned: true,
    },
    {
      name: "Rating Climber",
      description: "Gained 100 rating points",
      icon: TrendingUp,
      earned: false,
    },
    {
      name: "Chess Master",
      description: "Reach 1500 rating",
      icon: Crown,
      earned: false,
    },
  ];

  const currentStats = userStats[selectedTimeControl];
  const winRate = Math.round((currentStats.wins / currentStats.games) * 100);

  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  return (
    <div
      className={`flex min-h-screen ${bgImage} bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position="fixed" />
      <div className={`min-w-screen min-h-screen p-4`}>
        <div className="ml-[40px] flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24 dark:bg-white dark:text-black">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-4xl">
                      {user.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{user.username}</h1>
                      {user.isPremium && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-[#27272A] hover:bg-[#212124] rounded-xl font-semibold text-white"
                        >
                          <Star className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {userStats.blitz.rating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA]">Blitz</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {userStats.bullet.rating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA]">
                          Bullet
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {userStats.rapid.rating}
                        </div>
                        <div className="text-sm dark:text-[#A1A1AA]">Rapid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {userStats.blitz.games +
                            userStats.bullet.games +
                            userStats.rapid.games}
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

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="px-[10px] py-[2px] grid w-full grid-cols-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger
                  value="games"
                  className="data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Game History
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Rating Progress
                          <div className="flex gap-2">
                            {(
                              ["blitz", "bullet", "rapid"] as TimeControl[]
                            ).map((type) => (
                              <Button
                                key={type}
                                variant={
                                  selectedTimeControl === type
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedTimeControl(type)}
                                className={`capitalize dark:border-[#27272A] dark:bg-[#09090B] dark:text-white`}
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RatingChart timeControl={selectedTimeControl} />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Card className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">
                          {selectedTimeControl} Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="dark:text-[#A1A1AA]">
                            Current Rating
                          </span>
                          <span className="font-bold text-lg">
                            {currentStats.rating}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="dark:text-[#A1A1AA]">
                            Peak Rating
                          </span>
                          <span className="font-bold text-green-600">
                            {currentStats.peak}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="dark:text-[#A1A1AA]">
                            Games Played
                          </span>
                          <span className="font-bold">
                            {currentStats.games}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="dark:text-[#A1A1AA]">
                              Win Rate
                            </span>
                            <span className="font-bold">{winRate}%</span>
                          </div>
                          <Progress value={winRate} className="h-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <div className="font-bold text-green-600">
                              {currentStats.wins}
                            </div>
                            <div className="dark:text-[#A1A1AA]">Wins</div>
                          </div>
                          <div>
                            <div className="font-bold text-red-600">
                              {currentStats.losses}
                            </div>
                            <div className="dark:text-[#A1A1AA]">Losses</div>
                          </div>
                          <div>
                            <div className="font-bold text-yellow-600">
                              {currentStats.draws}
                            </div>
                            <div className="dark:text-[#A1A1AA]">Draws</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {(["blitz", "bullet", "rapid"] as TimeControl[]).map(
                    (timeControl) => {
                      const stats = userStats[timeControl];
                      const rate = Math.round((stats.wins / stats.games) * 100);

                      return (
                        <Card
                          key={timeControl}
                          className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white"
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 capitalize text-2xl">
                              {timeControl === "blitz" && (
                                <Clock className="w-5 h-5 text-green-600" />
                              )}
                              {timeControl === "bullet" && (
                                <Zap className="w-5 h-5 text-blue-600" />
                              )}
                              {timeControl === "rapid" && (
                                <Calendar className="w-5 h-5 text-purple-600" />
                              )}
                              {timeControl}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {stats.rating}
                              </div>
                              <div className="text-sm dark:text-[#A1A1AA]">
                                Current Rating
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Peak</span>
                                <span className="font-bold">{stats.peak}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Games</span>
                                <span className="font-bold">{stats.games}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Win Rate</span>
                                <span className="font-bold">{rate}%</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1 text-center text-xs">
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                                <div className="font-bold">{stats.wins}</div>
                                <div className="dark:text-[#A1A1AA]">W</div>
                              </div>
                              <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
                                <div className="font-bold">{stats.losses}</div>
                                <div className="dark:text-[#A1A1AA]">L</div>
                              </div>
                              <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                                <div className="font-bold">{stats.draws}</div>
                                <div className="dark:text-[#A1A1AA]">D</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </TabsContent>

              <TabsContent value="games">{/* <GameHistory /> */}</TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className={`bg-card/50 backdrop-blur-sm ${achievement.earned ? "border-green-500" : "opacity-60"} dark:bg-[#09090B] dark:text-white`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              achievement.earned
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-muted"
                            }`}
                          >
                            <achievement.icon
                              className={`w-5 h-5 ${achievement.earned ? "text-green-600" : "dark:text-[#A1A1AA]"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {achievement.name}
                            </div>
                            <div className="text-sm dark:text-[#A1A1AA]">
                              {achievement.description}
                            </div>
                          </div>
                          {achievement.earned && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              Earned
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
