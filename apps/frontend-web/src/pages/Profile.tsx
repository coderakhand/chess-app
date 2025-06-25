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
import { useBgImageStore } from "../store/atoms";
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

  const recentActivity = [
    {
      type: "game",
      result: "win",
      opponent: "ChessMaster99",
      timeControl: "blitz",
      date: "2 hours ago",
    },
    { type: "puzzle", count: 5, date: "1 day ago" },
    {
      type: "game",
      result: "loss",
      opponent: "QueenGambit",
      timeControl: "rapid",
      date: "2 days ago",
    },
    {
      type: "game",
      result: "draw",
      opponent: "KnightRider",
      timeControl: "bullet",
      date: "3 days ago",
    },
  ];

  const currentStats = userStats[selectedTimeControl];
  const winRate = Math.round((currentStats.wins / currentStats.games) * 100);

  return (
    <div
      className={`flex min-h-screen ${bgImage} bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position="fixed" />

      <div className="ml-[40px] flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.username[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    {user.isPremium && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
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
                      <div className="text-sm text-muted-foreground">Blitz</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userStats.bullet.rating}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bullet
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {userStats.rapid.rating}
                      </div>
                      <div className="text-sm text-muted-foreground">Rapid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {userStats.blitz.games +
                          userStats.bullet.games +
                          userStats.rapid.games}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Games
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button>Edit Profile</Button>
                  <Button variant="outline">Share Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="games">Game History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Rating Progress
                        <div className="flex gap-2">
                          {(["blitz", "bullet", "rapid"] as TimeControl[]).map(
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
                      <RatingChart timeControl={selectedTimeControl} />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {selectedTimeControl} Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Current Rating</span>
                        <span className="font-bold text-lg">
                          {currentStats.rating}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Peak Rating</span>
                        <span className="font-bold text-green-600">
                          {currentStats.peak}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Games Played</span>
                        <span className="font-bold">{currentStats.games}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Win Rate</span>
                          <span className="font-bold">{winRate}%</span>
                        </div>
                        <Progress value={winRate} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-bold text-green-600">
                            {currentStats.wins}
                          </div>
                          <div className="text-muted-foreground">Wins</div>
                        </div>
                        <div>
                          <div className="font-bold text-red-600">
                            {currentStats.losses}
                          </div>
                          <div className="text-muted-foreground">Losses</div>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-600">
                            {currentStats.draws}
                          </div>
                          <div className="text-muted-foreground">Draws</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm"
                          >
                            {activity.type === "game" ? (
                              <>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    activity.result === "win"
                                      ? "bg-green-500"
                                      : activity.result === "loss"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                  }`}
                                />
                                <span className="flex-1">
                                  {activity.result === "win"
                                    ? "Won"
                                    : activity.result === "loss"
                                      ? "Lost"
                                      : "Drew"}{" "}
                                  vs {activity.opponent}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {activity.timeControl}
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Target className="w-4 h-4 text-blue-500" />
                                <span className="flex-1">
                                  Solved {activity.count} puzzles
                                </span>
                              </>
                            )}
                            <span className="text-muted-foreground text-xs">
                              {activity.date}
                            </span>
                          </div>
                        ))}
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
                        className="bg-card/50 backdrop-blur-sm"
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 capitalize">
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
                            <div className="text-sm text-muted-foreground">
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
                              <div className="text-muted-foreground">W</div>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
                              <div className="font-bold">{stats.losses}</div>
                              <div className="text-muted-foreground">L</div>
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                              <div className="font-bold">{stats.draws}</div>
                              <div className="text-muted-foreground">D</div>
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
                    className={`bg-card/50 backdrop-blur-sm ${achievement.earned ? "border-green-500" : "opacity-60"}`}
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
                            className={`w-5 h-5 ${achievement.earned ? "text-green-600" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-muted-foreground">
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
  );
}
