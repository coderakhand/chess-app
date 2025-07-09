import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME, GAME_OVER, MOVE, PENDING_GAME } from "../config";
import { Chess } from "chess.js";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
import { useGameInfoStore } from "../store/atoms";
import useAuth from "../hooks/useAuth";
import PlayerCard from "../components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { games } from "../config";
import { Calendar, ChevronsUpDown, Clock, Zap } from "lucide-react";

export default function Play() {
  const { user } = useAuth();

  const socket = useSocket();

  const [isGameStarted, setIsGameStarted] = useState(false);

  const setChess = useGameInfoStore((state) => state.setChess);
  const chess = useGameInfoStore((state) => state.chess);
  const setBoard = useGameInfoStore((state) => state.setBoard);

  const color = useGameInfoStore((state) => state.color);
  const setColor = useGameInfoStore((state) => state.setColor);
  const setResult = useGameInfoStore((state) => state.setResult);

  const setMove = useGameInfoStore((state) => state.setMoves);
  const setOpponentInfo = useGameInfoStore((state) => state.setOpponentInfo);
  const opponentInfo = useGameInfoStore((state) => state.opponentInfo);

  const setGameCreationTime = useGameInfoStore(
    (state) => state.setGameCreationTime
  );
  const timeControl = useGameInfoStore((state) => state.timeControl);
  const setTimeControl = useGameInfoStore((state) => state.setTimeControl);
  const timeLeft = useGameInfoStore((state) => state.timeLeft);
  const setTimeLeft = useGameInfoStore((state) => state.setTimeLeft);
  const opponentTimeLeft = useGameInfoStore((state) => state.opponentTimeLeft);
  const setOpponentTimeLeft = useGameInfoStore(
    (state) => state.setOpponentTimeLeft
  );

  const timeLeftRef = useRef<number | null>(null);
  const opponentTimeLeftRef = useRef<number | null>(null);

  const gameStatus = useGameInfoStore((state) => state.gameStatus);
  const setGameStatus = useGameInfoStore((state) => state.setGameStatus);
  const [isGameLoading, setIsGameLoading] = useState(false);

  const rating =
    timeControl.name === "BULLET"
      ? user.ratings.bullet
      : timeControl.name === "BLITZ"
        ? user.ratings.blitz
        : user.ratings.rapid;

  useEffect(() => {
    const handleGame = () => {
      if (!socket) return;
      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        const { type, payload } = message;

        switch (type) {
          case PENDING_GAME: {
            console.log(payload);
            const newChess = new Chess(payload.position);
            setChess(newChess);
            setBoard(newChess.board());
            setTimeControl(payload.timeControl);
            setIsGameStarted(true);
            setColor(payload.userInfo.color);
            setTimeLeft(payload.userInfo.timeLeft);
            setOpponentInfo({
              username: payload.opponentInfo.username,
              rating: payload.opponentInfo.rating,
            });
            setOpponentTimeLeft(payload.opponentInfo.timeLeft);
            break;
          }

          case INIT_GAME: {
            const newChess = new Chess();
            setChess(newChess);
            setBoard(newChess.board());
            setColor(payload.userInfo.color);
            setIsGameStarted(true);
            setOpponentInfo(payload.opponentInfo);
            setGameCreationTime(Date.now());
            timeLeftRef.current = timeControl.baseTime;
            opponentTimeLeftRef.current = timeControl.baseTime;
            setGameStatus("ACTIVE");
            break;
          }

          case MOVE: {
            const move = payload.move;
            const time = payload.time;
            console.log(move);
            chess.move(move);
            setBoard(chess.board());
            setMove(move);
            if (color === "w") {
              timeLeftRef.current = time.w;
              opponentTimeLeftRef.current = time.b;
              console.log("yourTime: ", time.w, "  hisTime: ", time.b);
            } else {
              timeLeftRef.current = time.b;
              opponentTimeLeftRef.current = time.w;
              console.log("yourTime: ", time.b, "  hisTime: ", time.w);
            }

            break;
          }

          case GAME_OVER: {
            setResult({ winner: payload.winner, reason: payload.reason });
            setGameStatus("OVER");
            console.log(payload.reason);
            break;
          }

          case "TIME_UPDATE": {
            const { time } = payload;
            if (color === "w") {
              timeLeftRef.current = time.w;
              opponentTimeLeftRef.current = time.b;
              setTimeLeft(time.w);
              setOpponentTimeLeft(time.b);
              console.log("yourTime: ", time.w, "  hisTime: ", time.b);
            } else {
              timeLeftRef.current = time.b;
              opponentTimeLeftRef.current = time.w;
              setOpponentTimeLeft(time.w);
              setTimeLeft(time.b);
              console.log("yourTime: ", time.b, "  hisTime: ", time.w);
            }
          }
        }
      };
    };

    handleGame();
  }, [
    socket,
    chess,
    setMove,
    setOpponentInfo,
    setBoard,
    setChess,
    setGameCreationTime,
    setOpponentTimeLeft,
    setTimeLeft,
    timeControl,
    setColor,
    color,
    setTimeControl,
    setGameStatus,
    setResult,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGameStarted && gameStatus != "OVER") {
      interval = setInterval(() => {
        if (chess.turn() === color) {
          if (timeLeftRef.current === null) return;
          const clock = timeLeftRef.current - 1000;
          const newTime = clock >= 0 ? clock : 0;
          timeLeftRef.current = newTime;
          setTimeLeft(newTime);
        } else {
          if (opponentTimeLeftRef.current === null) return;
          const clock = opponentTimeLeftRef.current - 1000;
          const newTime = clock >= 0 ? clock : 0;
          opponentTimeLeftRef.current = newTime;
          setOpponentTimeLeft(newTime);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isGameStarted,
    color,
    setTimeLeft,
    setOpponentTimeLeft,
    chess,
    opponentTimeLeft,
    timeLeft,
    timeControl,
    gameStatus,
  ]);

  const createGame = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          isRated: true,
          timeControl: timeControl,
          userInfo: {
            isGuest: user.isGuest,
            id: user.id,
            username: user.username,
            rating: rating,
          },
        },
      })
    );
  };

  const offerDraw = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "OFFER_DRAW",
      })
    );
  };

  const resignGame = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "RESIGN_GAME",
      })
    );
  };

  return (
    <div
      className={`flex min-w-screen min-h-screen lg:h-screen  gap-[100px] bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position={"fixed"} />

      <div className="flex max-lg:flex-col  max-lg:items-center justify-center min-w-screen min-h-screen py-[30px] gap-6">
        <div className="flex-grow max-w-[560px] flex flex-col gap-2 h-full">
          <PlayerCard
            player={opponentInfo.username}
            rating={opponentInfo.rating}
            color={color === "w" ? "b" : "w"}
            time={opponentTimeLeft}
          />

          <ChessBoard socket={socket} />

          <PlayerCard
            player={user.username}
            rating={rating}
            color={color}
            time={timeLeft}
          />
        </div>

        <div className="flex flex-col h-full w-full md:w-[400px] gap-3">
          <div className="flex justify-center w-full h-screen max-h-[900px]">
            <div
              className={`flex flex-col items-center p-[5px] gap-3 w-full md:w-[360px]`}
            >
              <div className="w-full h-full flex rounded-xl">
                <Tabs
                  defaultValue="new_moves_chat"
                  className="flex flex-col w-full gap-3"
                >
                  <TabsList className="h-[40px] py-[5px] px-[20px] grid w-full grid-cols-3 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none font-medium">
                    <TabsTrigger
                      value="new_moves_chat"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      {gameStatus === null ? "New" : "Moves"}
                    </TabsTrigger>

                    <TabsTrigger
                      value="games"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Games
                    </TabsTrigger>

                    <TabsTrigger
                      value="friends"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Friends
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="new_moves_chat"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    {gameStatus !== null ? (
                      <div className="grid grid-rows-10">
                        <MovesTable />
                        <div className="flex w-full justify-start items-center gap-5">
                          <Button onClick={resignGame}>Resign</Button>
                          <Button onClick={offerDraw}>Draw</Button>
                        </div>
                        <ChatBox />
                      </div>
                    ) : (
                      <div className="flex justify-center w-full h-full py-[20px]">
                        <div className="flex flex-col items-center gap-6">
                          <Collapsible className="w-[240px] dark:bg-black dark:text-white dark:border-none rounded-sm overflow-hidden">
                            <CollapsibleTrigger className="flex gap-2 w-full justify-center items-center h-[50px]">
                              {timeControl.name === "RAPID" ? (
                                <Calendar className="w-4 h-4 text-purple-600" />
                              ) : timeControl.name === "BLITZ" ? (
                                <Clock className="w-4 h-4 text-green-600" />
                              ) : (
                                <Zap className="w-4 h-4 text-blue-600" />
                              )}
                              {timeControl.baseTime / 60000} |{" "}
                              {timeControl.increment / 1000}
                              <p>({timeControl.name})</p>
                              <ChevronsUpDown></ChevronsUpDown>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="rounded-xl">
                              {games.map((game) => (
                                <Card className="w-full h-[100px] flex flex-col justify-center gap-2 border-none ">
                                  <CardHeader className="h-full flex items-center font-bold">
                                    {game.name.toLowerCase() === "rapid" ? (
                                      <Calendar className="w-4 h-4 text-purple-600" />
                                    ) : game.name.toLowerCase() === "blitz" ? (
                                      <Clock className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Zap className="w-4 h-4 text-blue-600" />
                                    )}
                                    {game.name}
                                  </CardHeader>

                                  <CardContent className="flex gap-3">
                                    {game.types.map((gameTimeControl) => (
                                      <Button
                                        onClick={() =>
                                          setTimeControl({
                                            name: game.name.toUpperCase(),
                                            baseTime:
                                              gameTimeControl.baseTime *
                                              60 *
                                              1000,
                                            increment:
                                              gameTimeControl.increment * 1000,
                                          })
                                        }
                                        className="dark:bg-white dark:hover:bg-[#E2E2E2] text-black font-medium cursor-pointer"
                                      >
                                        {gameTimeControl.baseTime} |{" "}
                                        {gameTimeControl.increment}
                                      </Button>
                                    ))}
                                  </CardContent>
                                </Card>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>

                          <Button
                            onClick={() => {
                              setIsGameLoading(true);
                              createGame();
                            }}
                            disabled={isGameLoading}
                            className="w-[200px] h-[50px] text-white bg-[#8CA2AD] dark:bg-green-600 dark:hover:bg-green-700 font-semibold text-xl cursor-pointer"
                          >
                            Start Game
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="games"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  ></TabsContent>

                  <TabsContent
                    value="friends"
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

function MovesTable() {
  const moves = useGameInfoStore((state) => state.moves);
  return (
    <div className="w-full bg-white max-h-[300px] border-2">
      <div className="w-full flex">
        <div className="w-full flex justify-center">White</div>
        <div className="w-full flex justify-center">Black</div>
      </div>
      <div className="w-full">
        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, idx) => {
          const whiteMove = moves[idx * 2];
          const blackMove = moves[idx * 2 + 1];

          return (
            <div key={idx} className="flex bg-green-300 p-2">
              <div className="w-8">{idx + 1}</div>
              <Move whiteMove={whiteMove} blackMove={blackMove} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Move({
  whiteMove,
  blackMove,
}: {
  whiteMove?: { from: string; to: string };
  blackMove?: { from: string; to: string };
}) {
  return (
    <div className="flex gap-4">
      <div className="w-32 text-left">
        {whiteMove ? `${whiteMove.from} → ${whiteMove.to}` : ""}
      </div>
      <div className="w-32 text-left">
        {blackMove ? `${blackMove.from} → ${blackMove.to}` : ""}
      </div>
    </div>
  );
}

function ChatBox() {
  return <div className="w-full h-[150px]"></div>;
}
