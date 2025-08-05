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
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Plus,
  RotateCw,
  SendHorizonal,
  User,
  Users,
  Zap,
} from "lucide-react";
import MovesTable from "../components/MovesTable";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function Game() {
  interface Friend {
    id: string;
    username: string;
    status: "online" | "offline" | "playing";
    rating: number;
  }
  const friends: Friend[] = [
    { id: "1", username: "akhand", status: "offline", rating: 800 },
  ];
  const { user } = useAuth();

  const socket = useSocket();

  const [isGameStarted, setIsGameStarted] = useState(false);

  const setChess = useGameInfoStore((state) => state.setChess);
  const chess = useGameInfoStore((state) => state.chess);
  const setBoard = useGameInfoStore((state) => state.setBoard);

  const color = useGameInfoStore((state) => state.color);
  const setColor = useGameInfoStore((state) => state.setColor);
  const setResult = useGameInfoStore((state) => state.setResult);

  const setMove = useGameInfoStore((state) => state.setMove);
  const setMoves = useGameInfoStore((state) => state.setMoves);
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
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);

  const [chat, setChat] = useState<{ sender: string; message: string }[]>([]);
  const [isDrawOffered, setIsDrawOffered] = useState<boolean>(false);

  const showPositionAtMovesIndexDecrease = useGameInfoStore(
    (state) => state.showPositionAtMovesIndexDecrease
  );
  const showPositionAtMovesIndexIncrease = useGameInfoStore(
    (state) => state.showPositionAtMovesIndexIncrease
  );

  const flipBoard = useGameInfoStore((state) => state.flipBoard);
  const setFlipBoard = useGameInfoStore((state) => state.setFlipBoard);
  const toggleFlipBoard = useGameInfoStore((state) => state.toggleFlipBoard);

  const [chatMessage, setChatMessage] = useState("");

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
            setMoves([]);
            const newChess = new Chess(payload.position);
            setChess(newChess);
            setBoard(newChess.board());
            setTimeControl(payload.timeControl);
            setIsGameStarted(true);
            setIsGameLoading(false);
            setColor(payload.userInfo.color);
            setTimeLeft(payload.userInfo.timeLeft);
            setOpponentInfo({
              username: payload.opponentInfo.username,
              rating: payload.opponentInfo.rating,
            });
            setOpponentTimeLeft(payload.opponentInfo.timeLeft);
            setChat([]);
            break;
          }

          case INIT_GAME: {
            const newChess = new Chess();
            setMoves([]);
            setChess(newChess);
            setBoard(newChess.board());
            setColor(payload.userInfo.color);
            if (payload.userInfo.color == "w") {
              setFlipBoard(false);
            } else {
              setFlipBoard(true);
            }
            setIsGameStarted(true);
            setIsGameLoading(false);
            setOpponentInfo(payload.opponentInfo);
            setGameCreationTime(Date.now());
            timeLeftRef.current = timeControl.baseTime;
            opponentTimeLeftRef.current = timeControl.baseTime;
            setGameStatus("ACTIVE");
            setChat([]);
            break;
          }

          case MOVE: {
            const move = payload.move;
            const time = payload.time;
            const m = chess.move(move);
            setBoard(chess.board());
            setMove({
              ...move,
              piece: m.piece,
              after: m.after,
              before: m.before,
              isCapture: m.isCapture() || m.isEnPassant(),
              isKingsideCastle: m.isKingsideCastle(),
              isQueensideCastle: m.isQueensideCastle(),
              isPromotion: m.isPromotion(),
            });
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
            break;
          }

          case "DRAW_OFFER": {
            setIsDrawOffered(true);
            break;
          }

          case "DRAW_ANSWER": {
            console.log("draw answer: ", payload);
            const isAccepted = payload.isAccepted || false;
            if (isAccepted) {
              alert("Draw  by opponent");
            }
            break;
          }

          case "PLAYER_CHAT": {
            const message = payload.message;
            if (!message) return;
            setChat([
              ...chat,
              { sender: opponentInfo.username, message: message },
            ]);
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
    chat,
    setMoves,
    setFlipBoard,
    opponentInfo,
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

  const rematch = () => {
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
        type: "DRAW_OFFER",
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

  const answerDraw = (isAccepted: boolean) => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "DRAW_ANSWER",
        payload: {
          isAccepted: isAccepted,
        },
      })
    );
    setIsDrawOffered(false);
  };

  const sendChatMessage = () => {
    if (!socket || chatMessage.trim() === "") return;
    setChat([...chat, { sender: "You", message: chatMessage }]);
    socket.send(
      JSON.stringify({
        type: "PLAYER_CHAT",
        payload: {
          message: chatMessage,
        },
      })
    );
    setChatMessage("");
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const images = ["Oliver", "Ryan", "Nolan", "Leah"];
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (isGameLoading) {
      setInterval(() => {
        setImgIdx((prev) => (prev + 1) % 4);
      }, 1000);
    }
  }, [isGameLoading]);

  return (
    <div
      className={`flex max-lg:flex-col w-screen lg:h-screen  lg:gap-[100px] bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />

      <div className="flex max-lg:flex-col  max-lg:items-center lg:justify-center w-full min-h-screen py-[30px] gap-10 sm:gap-6 sm:pl-[80px] px-1 max-sm:px-3 max-sm:pt-[100px]">
        <div className="relative flex-grow max-w-[560px] flex flex-col gap-2 h-full">
          {isGameLoading ? (
            <PlayerCard
              player={"Searching..."}
              color={"b"}
              time={timeControl.baseTime}
              imageUrl={`https://api.dicebear.com/9.x/avataaars/svg?seed=${images[imgIdx]}&size=36&backgroundColor=b6e3f4,c0aede,d1d4f9
`}
            />
          ) : color == "w" ? (
            <PlayerCard
              player={!flipBoard ? opponentInfo.username : user.username}
              rating={!flipBoard ? opponentInfo.rating : user.ratings.rapid}
              color={!flipBoard ? (color == "w" ? "b" : "w") : color}
              time={!flipBoard ? opponentTimeLeft : timeLeft}
            />
          ) : (
            <PlayerCard
              player={flipBoard ? opponentInfo.username : user.username}
              rating={flipBoard ? opponentInfo.rating : user.ratings.rapid}
              color={flipBoard ? (color == "w" ? "b" : "w") : color}
              time={flipBoard ? opponentTimeLeft : timeLeft}
            />
          )}

          <ChessBoard socket={socket} />

          {isGameLoading ? (
            <PlayerCard
              player={user.username}
              rating={user.ratings.rapid}
              color={"w"}
              time={timeControl.baseTime}
            />
          ) : color == "w" ? (
            <PlayerCard
              player={flipBoard ? opponentInfo.username : user.username}
              rating={flipBoard ? opponentInfo.rating : user.ratings.rapid}
              color={flipBoard ? (color == "w" ? "b" : "w") : color}
              time={flipBoard ? opponentTimeLeft : timeLeft}
            />
          ) : (
            <PlayerCard
              player={!flipBoard ? opponentInfo.username : user.username}
              rating={!flipBoard ? opponentInfo.rating : user.ratings.rapid}
              color={!flipBoard ? (color == "w" ? "b" : "w") : color}
              time={!flipBoard ? opponentTimeLeft : timeLeft}
            />
          )}
        </div>

        <div className="flex flex-col h-full w-full sm:w-[580px]  lg:w-[400px] gap-3 md:px-10 ">
          <div className="flex justify-center w-full min-h-[600px] lg:h-screen max-h-[900px]">
            <div
              className={`flex flex-col items-center py-[5px] gap-3 w-full lg:w-[360px]`}
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
                      value="games_archieve"
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
                      <div
                        className="h-full pt-1 grid grid-rows-[66%_34%]"
                        onKeyDown={(event) => {
                          if (event.key === "ArrowRight")
                            showPositionAtMovesIndexIncrease();
                          if (event.key === "ArrowLeft")
                            showPositionAtMovesIndexDecrease();
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="w-full flex items-center justify-center font-semibold font-dream dark:text-white">
                            Moves
                          </div>
                          <div className="flex-grow overflow-y-auto">
                            <MovesTable />
                          </div>
                          {isGameLoading && (
                            <div className="backdrop-blur-3xl w-full flex py-1 justify-center items-center gap-3">
                              <p className="text-sm font-bold font-proza">
                                Searching for Opponent...
                              </p>
                              <Button
                                onClick={() => {
                                  setIsGameLoading(false);
                                  socket?.send(
                                    JSON.stringify({
                                      type: "ABANDON_GAME",
                                    })
                                  );
                                }}
                                className=" bg-white hover:bg-white/70 hover:backdrop-blur-2xl  rounded-xl cursor-pointer"
                              >
                                cancel
                              </Button>
                            </div>
                          )}

                          <div className=" flex items-center gap-2 dark:bg-[#7b7b7f] px-2 py-1 bg-white/40 backdrop-blur-lg shadow-xl">
                            {gameStatus == "ACTIVE" && (
                              <div className="flex gap-1">
                                <button
                                  onClick={offerDraw}
                                  className="text-sm font-bold text-black/80 p-1 rounded-lg cursor-pointer"
                                >
                                  1/2 Draw
                                </button>
                                <button
                                  onClick={resignGame}
                                  className="text-sm font-bold text-black/80 p-1  rounded-lg cursor-pointer"
                                >
                                  Resign
                                </button>
                              </div>
                            )}

                            <div className="flex-grow flex justify-end items-center gap-2">
                              <Button
                                size="icon"
                                className="w-8 h-8 bg-white hover:bg-white/70 hover:backdrop-blur-2xl  rounded-xl cursor-pointer"
                                onClick={showPositionAtMovesIndexDecrease}
                              >
                                <ChevronLeft className="w-8 h-8 stroke-3" />
                              </Button>

                              <Button
                                size="icon"
                                className="w-8 h-8 bg-white hover:bg-white/70 hover:backdrop-blur-2xl rounded-xl cursor-pointer"
                                onClick={showPositionAtMovesIndexIncrease}
                              >
                                <ChevronRight className="w-8 h-8 stroke-3" />
                              </Button>

                              {gameStatus == "OVER" && (
                                <>
                                  <Button
                                    size="icon"
                                    onClick={() => {
                                      setIsGameLoading(true);
                                      createGame();
                                    }}
                                    disabled={isGameLoading}
                                    className="w-8 h-8 bg-white hover:bg-white/70 hover:backdrop-blur-2xl rounded-xl cursor-pointer"
                                  >
                                    <Plus className="w-6 h-6 stroke-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    onClick={() => {
                                      setIsGameLoading(true);
                                      rematch();
                                    }}
                                    disabled={isGameLoading}
                                    className="w-8 h-8 bg-white hover:bg-white/70 hover:backdrop-blur-2xl rounded-xl cursor-pointer"
                                  >
                                    <RotateCw className="w-8 h-8 stroke-3" />
                                  </Button>
                                </>
                              )}

                              <Button
                                size="icon"
                                className="w-8 h-8 bg-white hover:bg-white/70 hover:backdrop-blur-2xl  rounded-xl cursor-pointer"
                                onClick={toggleFlipBoard}
                              >
                                <ArrowUpDown className="w-8 h-8 stroke-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className=" h-full flex flex-col overflow-y-auto">
                          <div className="flex-grow">
                            {isDrawOffered && (
                              <div>
                                <Button onClick={() => answerDraw(true)}>
                                  Yes
                                </Button>
                                <Button onClick={() => answerDraw(false)}>
                                  No
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="relative overflow-y-auto flex flex-col gap-1 h-full p-1">
                            {chat.map((p) => (
                              <div className="flex gap-1 text-sm">
                                <span className="font-bold text-black/40 dark:text-slate-300">
                                  {p.sender}:
                                </span>
                                <p className="dark:text-white">{p.message}</p>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>

                          <div className="w-full flex items-center border-white/40 border-t-1">
                            <div
                              className="w-full flex items-center h-full pr-2"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") sendChatMessage();
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Send a message...."
                                value={chatMessage}
                                className="w-full h-8 px-2 outline-none text-sm dark:text-white/90 dark:placeholder-[#A1A1A1]"
                                onChange={(e) => setChatMessage(e.target.value)}
                              />
                              <SendHorizonal className="w-5 h-5 stroke-gray-600 dark:stroke-gray-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center w-full h-full py-[20px]">
                        <div className="flex flex-col items-center gap-6">
                          <Collapsible className="w-[240px]  dark:text-white dark:border-none rounded-sm overflow-hidden">
                            <CollapsibleTrigger className="flex gap-2 w-full justify-center items-center h-[50px] bg-white/18 dark:bg-black/70">
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

                            <CollapsibleContent className="flex flex-col rounded-xl p-1 gap-2">
                              {games.map((game) => (
                                <Card className="w-full h-[100px] flex flex-col justify-center gap-2 border-none bg-white/10 dark:bg-black/70">
                                  <CardHeader className="h-full flex items-center font-bold font-dream">
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
                                        className="bg-white/10 hover:bg-white/20 dark:bg-white dark:hover:bg-[#E2E2E2] text-black font-medium cursor-pointer font-dream"
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
                            className="w-[200px] h-[50px] text-white bg-[#8CA2AD] hover:bg-[#879ca7] dark:bg-green-600 dark:hover:bg-green-700 font-semibold text-xl cursor-pointer font-dream"
                          >
                            Start Game
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="games_archieve"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  ></TabsContent>

                  <TabsContent
                    value="friends"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    <div className="space-y-4 px-3 py-4">
                      <div className="flex items-center gap-2 font-dream font-bold">
                        <Users className="w-5 h-5 stroke-3" />
                        Friends ({friends.length})
                      </div>
                      <div className="overflow-y-auto">
                        <div className="space-y-3">
                          {friends.map((friend) => (
                            <div
                              key={friend.id}
                              className="flex items-center justify-between bg-white/40 rounded-sm px-1"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                      <User className="w-4 h-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                                      friend.status === "online"
                                        ? "bg-green-500"
                                        : friend.status === "playing"
                                          ? "bg-yellow-500"
                                          : "bg-gray-400"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {friend.username}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {friend.rating} • {friend.status}
                                  </div>
                                </div>
                              </div>
                              <button className="outline-1  rounded-xs bg-black text-white hover:brightness-80 cursor-pointer text-xs p-0.5">
                                Challenge
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
