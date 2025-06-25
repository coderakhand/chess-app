import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SideBar from "./SideBar";
import { useBgImageStore } from "../store/atoms";
import { RatingChart } from "./RatingChart";
import {
  Play,
  BarChart3,
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

type TimeControl = "blitz" | "bullet" | "rapid";

export default function SignedInUserHome() {
  const bgImage = useBgImageStore((state) => state.bgImage);
  const [selectedTimeControl, setSelectedTimeControl] =
    useState<TimeControl>("blitz");

  const user = {
    username: "ChessPlayer",
    rank: "#1,247",
    ratings: {
      rapid: 1290,
      blitz: 1245,
      bullet: 1180,
    },
  };

  const recentGames = [
    {
      id: "1",
      opponent: "ChessMaster99",
      result: "win",
      timeControl: "blitz",
      rating: 1250,
      moves: 42,
      duration: "8:32",
      date: "2 hours ago",
    },
    {
      id: "2",
      opponent: "QueenGambit",
      result: "loss",
      timeControl: "rapid",
      rating: 1450,
      moves: 67,
      duration: "24:15",
      date: "1 day ago",
    },
    {
      id: "3",
      opponent: "KnightRider",
      result: "draw",
      timeControl: "bullet",
      rating: 1220,
      moves: 38,
      duration: "2:45",
      date: "2 days ago",
    },
    {
      id: "4",
      opponent: "PawnStorm",
      result: "win",
      timeControl: "blitz",
      rating: 1180,
      moves: 35,
      duration: "6:20",
      date: "3 days ago",
    },
    {
      id: "5",
      opponent: "RookMaster",
      result: "loss",
      timeControl: "rapid",
      rating: 1380,
      moves: 52,
      duration: "18:45",
      date: "4 days ago",
    },
  ];

  const quickPlayOptions = [
    {
      title: "New Game",
      description: "Play with someone at your level",
      icon: Play,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Play a Friend",
      description: "Challenge your friends",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Analyze Games",
      description: "Review your recent games",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div
      className={`flex min-h-screen ${bgImage} bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position="fixed" />

      <div className="ml-[40px] flex-1 p-6">
        <div className="w-full h-[150px] bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.username}!
            </h1>
            <p className="text-lg opacity-90">Ready to play some chess?</p>
          </div>
          <div className="absolute top-4 right-6 text-white">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Trophy className="w-3 h-3 mr-1" />
              Rank {user.rank}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center w-full mb-6 bg-card/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Rapid</span>
              </div>
              <div className="text-2xl font-bold">{user.ratings.rapid}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Blitz</span>
              </div>
              <div className="text-2xl font-bold">{user.ratings.blitz}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Bullet</span>
              </div>
              <div className="text-2xl font-bold">{user.ratings.bullet}</div>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +25 this week
          </Badge>
        </div>

        <div className="flex gap-6 mb-6">
          <Card className="w-[300px] bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                  <div className="flex items-center gap-3 w-full">
                    <option.icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{option.title}</div>
                      <div className="text-sm opacity-90">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Rating Progress
                <div className="flex gap-2">
                  {(["rapid", "blitz", "bullet"] as TimeControl[]).map(
                    (type) => (
                      <Button
                        key={type}
                        variant={
                          selectedTimeControl === type ? "default" : "outline"
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

        <Card className="w-full bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Games
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
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
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {game.opponent[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{game.opponent}</div>
                      <div className="text-xs text-muted-foreground">
                        {game.rating} • {game.moves} moves • {game.duration}
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
                      className={game.result === "win" ? "bg-green-600" : ""}
                    >
                      {game.result}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {game.date}
                  </div>

                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
