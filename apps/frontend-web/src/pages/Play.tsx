import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME, GAME_OVER, MOVE } from "../config";
import { Chess } from "chess.js";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
import { useBgImageStore, useGameInfoStore } from "../store/atoms";
import useAuth from "../hooks/useAuth";
import PlayerCard from "../components/PlayerCard";
import { Button } from "../components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export default function Play() {
  const { user } = useAuth();

  const bgImage = useBgImageStore((state) => state.bgImage);

  const socket = useSocket();

  const [isGameStarted, setIsGameStarted] = useState(false);

  const setChess = useGameInfoStore((state) => state.setChess);
  const chess = useGameInfoStore((state) => state.chess);
  const setBoard = useGameInfoStore((state) => state.setBoard);

  const color = useGameInfoStore((state) => state.color);
  const setColor = useGameInfoStore((state) => state.setColor);
  const [winner, setWinner] = useState(null);

  const setMove = useGameInfoStore((state) => state.setMoves);
  const setOpponentInfo = useGameInfoStore((state) => state.setOpponentInfo);
  const opponentInfo = useGameInfoStore((state) => state.opponentInfo);

  const setGameCreationTime = useGameInfoStore(
    (state) => state.setGameCreationTime
  );
  const timeControl = useGameInfoStore((state) => state.timeControl);
  const timeLeft = useGameInfoStore((state) => state.timeLeft);
  const setTimeLeft = useGameInfoStore((state) => state.setTimeLeft);
  const opponentTimeLeft = useGameInfoStore((state) => state.opponentTimeLeft);
  const setOpponentTimeLeft = useGameInfoStore(
    (state) => state.setOpponentTimeLeft
  );

  const timeLeftRef = useRef<number | null>(null);
  const opponentTimeLeftRef = useRef<number | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const gameStatus = useGameInfoStore((state) => state.gameStatus);

  useEffect(() => {
    const handleGame = () => {
      if (!socket) return;
      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        switch (message.type) {
          case INIT_GAME: {
            const newChess = new Chess();
            setChess(newChess);
            setBoard(newChess.board());
            setColor(message.payload.color);
            setIsGameStarted(true);
            setOpponentInfo(message.opponentInfo);
            setGameCreationTime(Date.now());
            timeLeftRef.current = timeControl.baseTime;
            opponentTimeLeftRef.current = timeControl.baseTime;
            break;
          }

          case MOVE: {
            const move = message.payload.move;
            const time = message.payload.time;
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
            const move = message.payload.move;
            chess.move(move);
            setBoard(chess.board());
            setWinner(message.payload.winner);
            break;
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
    timeControl.baseTime,
    setColor,
    color,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGameStarted && winner === null) {
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
    winner,
    color,
    setTimeLeft,
    setOpponentTimeLeft,
    chess,
    opponentTimeLeft,
    timeLeft,
  ]);

  const createGame = () => {
    if (socket === null) return;
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          timeControl: timeControl,
        },
        userInfo: {
          userId: user.id,
          username: user.username,
          rating: user.rating,
        },
      })
    );
  };

  const offerDraw = () => {
    if (socket === null) return;
    socket.send(
      JSON.stringify({
        type: "OFFER_DRAW",
      })
    );
  };

  return (
    <div
      className={`flex min-w-screen min-h-screen lg:h-screen  gap-[100px] ${bgImage} bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar position={"fixed"} />

      <div className="flex justify-center min-w-screen min-h-screen pt-[30px] gap-6">
        <div className="flex flex-col gap-2 h-full">
          <PlayerCard
            player={opponentInfo.username}
            rating={opponentInfo.rating}
            color={color === "w" ? "b" : "w"}
            time={opponentTimeLeft}
          />

          <ChessBoard socket={socket} winner={winner} />

          <PlayerCard
            player={user.username}
            rating={user.rating}
            color={color}
            time={timeLeft}
          />
        </div>

        <div className="flex flex-col h-screen w-[400px] gap-3">
          <div className="flex flex-col gap-3 w-full items-center ">
            <div className="flex w-full h-full gap-4 justify-center">
              <div className="h-[160px] w-[290px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40">
                Opponent Video
              </div>
              <div className="py-[20px] px-[4px] flex flex-col justify-start gap-3  bg-white/30 backdrop-blur-md shadow-md border border-white/40  dark:border-[#27272A] dark:bg-[#18181B] h-full w-[45px] rounded-xl">
                <Button
                  variant={isMuted ? "destructive" : "ghost"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-full"
                >
                  {isMuted ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={!isVideoOn ? "destructive" : "ghost"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="w-full"
                >
                  {isVideoOn ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex w-full h-full gap-4 justify-center">
              <LocalVideo />
              <div className="bg-white/30 backdrop-blur-md shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#18181B] h-full w-[45px] rounded-xl"></div>
            </div>
          </div>

          <div className="flex justify-center w-full h-[350px] ">
            <div
              className={`flex flex-col items-center p-[5px] gap-3 w-[360px]`}
            >
              <div className="w-full h-[50px] flex rounded-xl">
                <Tabs defaultValue="new/move" className="w-full space-y-2">
                  <TabsList className="h-[40px] py-[3px] px-[20px] grid w-full grid-cols-3 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none">
                    <TabsTrigger
                      value="new/move"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      {gameStatus === null ? "New" : "Move"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="chat"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="friends"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Friends
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="new/move"
                    className="w-full h-[300px] space-y-6 bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    {gameStatus !== null && <MovesTable />}
                  </TabsContent>
                  <TabsContent
                    value="chat"
                    className="h-[300px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  ></TabsContent>
                  <TabsContent
                    value="friends"
                    className="h-[300px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
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

function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Failed to access webcam:", err);
      });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      muted
      playsInline
      className="h-[160px] w-[290px] rounded-xl object-cover"
    />
  );
}

function MovesTable() {
  const moves = useGameInfoStore((state) => state.moves);
  return (
    <div className="w-full bg-white">
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
