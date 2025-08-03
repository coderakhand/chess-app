import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameInfoStore} from "../store/atoms";
import api from "../api/axios";
import PlayerCard from "../components/PlayerCard";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import GameControls from "../components/GameControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export default function ViewGame() {
  const socket = useSocket();
  const obj = useParams();
  const gameId = obj.id;
  const setMoves = useGameInfoStore((state) => state.setMoves);
  const userInfo = useGameInfoStore((state) => state.userInfo);
  const setUserInfo = useGameInfoStore((state) => state.setUserInfo);

  const color = useGameInfoStore((state) => state.color);
  const setColor = useGameInfoStore((state) => state.setColor);
  const setResult = useGameInfoStore((state) => state.setResult);

  const opponentInfo = useGameInfoStore((state) => state.opponentInfo);
  const setOpponentInfo = useGameInfoStore((state) => state.setOpponentInfo);

  const timeControl = useGameInfoStore((state) => state.timeControl);
  const setTimeControl = useGameInfoStore((state) => state.setTimeControl);
  const timeLeft = useGameInfoStore((state) => state.timeLeft);
  const setTimeLeft = useGameInfoStore((state) => state.setTimeLeft);
  const opponentTimeLeft = useGameInfoStore((state) => state.opponentTimeLeft);
  const setOpponentTimeLeft = useGameInfoStore(
    (state) => state.setOpponentTimeLeft
  );

  useEffect(() => {
    if(!socket) return;
    
  })

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/${gameId}`);
        const data = response.data;
        const game = data.game;
        if (!game) return;
        console.log(data);
        setMoves(game.moves);
      } catch (e) {
        console.log(e);
      }
    };

    fetchGame();
  }, [gameId, setOpponentInfo, setMoves]);

  return (
    <div
      className={`flex max-lg:flex-col w-screen lg:h-screen  lg:gap-[100px] bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />

      <div className="flex max-lg:flex-col  max-lg:items-center justify-center w-screen min-h-screen py-[30px] gap-6 sm:pl-[60px] px-1 max-sm:px-3 max-sm:pt-[100px]">
        <div className="flex-grow max-w-[560px] flex flex-col gap-2 h-full">
          <PlayerCard
            player={opponentInfo.username}
            rating={opponentInfo.rating}
            color={color === "w" ? "b" : "w"}
            time={opponentTimeLeft}
          />

          <ChessBoard socket={socket} />

          <PlayerCard
            player={userInfo.username}
            rating={userInfo.rating}
            color={color}
            time={timeLeft}
          />
        </div>

        <div className="flex flex-col h-full w-full sm:w-[580px] md:w-[640px] lg:w-[400px] gap-3 md:px-10 ">
          <div className="flex justify-center w-full min-h-[600px] lg:h-screen max-h-[900px]">
            <div
              className={`flex flex-col items-center py-[5px] gap-3 w-full lg:w-[360px]`}
            >
              <div className="w-full h-full flex rounded-xl">
                <Tabs
                  defaultValue="analysis"
                  className="flex flex-col w-full gap-3"
                >
                  <TabsList className="h-[40px] py-[5px] px-[20px] grid w-full grid-cols-2 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none font-medium">
                    <TabsTrigger
                      value="analysis"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Analysis
                    </TabsTrigger>

                    <TabsTrigger
                      value="friends"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="analysis"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    <GameControls />
                  </TabsContent>

                  <TabsContent
                    value="details"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  ></TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
