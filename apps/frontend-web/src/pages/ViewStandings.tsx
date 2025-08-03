"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Crown, Trophy, Star, Medal } from "lucide-react";
import api from "../api/axios";
import SideBar from "../components/SideBar";

interface FidePlayer {
  rank: number;
  name: string;
  federation: string;
  flagAbbreviation: string;
  rating: number;
  birthYear: number;
}

const rankingCategories = {
  standard: {
    players: "STANDARD TOP PLAYERS",
    women: "STANDARD TOP WOMEN",
    juniors: "STANDARD TOP JUNIORS",
    girls: "STANDARD TOP GIRLS",
  },
  rapid: {
    players: "RAPID TOP PLAYERS",
    women: "RAPID TOP WOMEN",
    juniors: "RAPID TOP JUNIORS",
    girls: "RAPID TOP GIRLS",
  },
  blitz: {
    players: "BLITZ TOP PLAYERS",
    women: "BLITZ TOP WOMEN",
    juniors: "BLITZ TOP JUNIORS",
    girls: "BLITZ TOP GIRLS",
  },
};

export default function ChessRankings() {
  const [fidePlayers, setFidePlayers] = useState<FidePlayer[]>([]);
  const [activeFormat, setActiveFormat] = useState("standard");
  const [activeCategory, setActiveCategory] = useState("players");
  const [loading, setLoading] = useState(false);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
  };

  const fetchRankings = async (format: string, category: string) => {
    setLoading(true);
    let q;
    if (category == "players") {
      if (format == "standard") q = "open";
      else q = "men_" + format;
    } else if (format == "standard") {
      q = category;
    } else {
      q = category + "_" + format;
    }
    try {
      console.log(q);
      const response = await api.get(`http://localhost:3000/fide/ratings/${q}`);
      const data = response.data;
      setFidePlayers(data.players);
      console.log(data.players);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(activeFormat, activeCategory);
  }, [activeFormat, activeCategory]);

  return (
    <div
      className={`min-h-screen min-w-screen bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B] font-dream`}
    >
      <SideBar />
      <div className="max-sm:pt-[80px] sm:pl-[60px] min-w-screen min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                FIDE Chess Rankings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                World's top chess players across all formats
              </p>
            </motion.div>

            <Tabs
              value={activeFormat}
              onValueChange={setActiveFormat}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 px-3 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none">
                <TabsTrigger
                  value="standard"
                  className="text-sm font-medium data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Standard
                </TabsTrigger>
                <TabsTrigger
                  value="rapid"
                  className="text-sm font-medium data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Rapid
                </TabsTrigger>
                <TabsTrigger
                  value="blitz"
                  className="text-sm font-medium data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
                >
                  Blitz
                </TabsTrigger>
              </TabsList>

              {Object.entries(rankingCategories).map(([format, categories]) => (
                <TabsContent key={format} value={format}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={activeCategory === key ? "ghost" : "outline"}
                        onClick={() => setActiveCategory(key)}
                        className="h-auto py-3 px-4 text-xs font-medium transition-all duration-200 text-black dark:text-white backdrop-blur-xs bg-white/40 dark:bg-white/10"
                      >
                        {label}
                      </Button>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-20"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeFormat}-${activeCategory}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  {fidePlayers.map((player, index) => (
                    <motion.div
                      key={`${player.rank}-${player.name}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border-none backdrop-blur-xs dark:bg-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`${getRankBadgeColor(player.rank)} px-3 py-1 text-sm font-bold`}
                                >
                                  #{player.rank}
                                </Badge>
                                {getRankIcon(player.rank)}
                              </div>

                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {player.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>

                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-6 rounded overflow-hidden shadow-sm">
                                  <img
                                    src={`https://flagcdn.com/w40/${player.flagAbbreviation == "zz" ? "ru" : player.flagAbbreviation}.png`}
                                    alt={`${player.federation} flag`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "/placeholder.svg?height=24&width=32";
                                    }}
                                  />
                                </div>

                                <div>
                                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                                    {player.name}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {player.federation} • Born{" "}
                                    {player.birthYear}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {player.rating}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Rating
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
