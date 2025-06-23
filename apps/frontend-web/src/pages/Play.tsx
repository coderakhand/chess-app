import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME, GAME_OVER, MOVE } from "../config";
import { Chess } from "chess.js";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
import { useBgImageStore, useGameInfoStore } from "../store/atoms";
import useAuth from "../hooks/useAuth";
import PlayerCard from "../components/PlayerCard";

export default function Play() {
  const { user } = useAuth();

  const bgImage = useBgImageStore((state) => state.bgImage);

  const socket = useSocket();

  const [isGameStarted, setIsGameStarted] = useState(false);

  const [tab, setTab] = useState("new");

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
          const clock = (timeLeft ?? 0) - 1000;
          const newTime = clock >= 0 ? clock : 0;
          timeLeftRef.current = newTime;
        } else {
          const clock = (opponentTimeLeft ?? 0) - 1000;
          const newTime = clock >= 0 ? clock : 0;
          opponentTimeLeftRef.current = newTime;
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


  return (
    <div
      className={`flex min-w-screen min-h-screen lg:h-screen  gap-[100px] ${bgImage} bg-fixed bg-cover bg-center`}
    >
      <SideBar position={"fixed"} />

      <div className="flex justify-center min-w-screen py-[30px] gap-6">
        <div className="flex flex-col gap-2">
          <PlayerCard
            player={opponentInfo.username}
            rating={opponentInfo.rating}
            color={color === "w" ? "b" : "w"}
            time={opponentTimeLeftRef.current}
          />

          <ChessBoard socket={socket} winner={winner} />

          <PlayerCard
            player={user.username}
            rating={user.rating}
            color={color}
            time={timeLeftRef.current}
          />
        </div>

        <div className="flex flex-col h-screen w-[400px] gap-3">
          <div className="w-full px-[20px] h-[200px]">
            <div className="h-[200px] w-[360px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40">
              Opponent Video
            </div>
          </div>

          <div className="w-full px-[20px] h-[200px]">
            <LocalVideo />
          </div>

          <div className="flex justify-center w-full h-[270px] ">
            <div
              className="flex flex-col items-center p-[5px] gap-3 w-[360px]
            bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40"
            >
              <div className="w-full h-[50px] flex rounded-xl">
                <button
                  onClick={() => setTab("new")}
                  className={`w-full rounded-xl cursor-pointer ${
                    tab !== "new" ? "" : "backdrop-blur-md shadow-md"
                  }`}
                >
                  {isGameStarted ? "Moves" : "New"}
                </button>

                <button
                  onClick={() => setTab("friends")}
                  className={`w-full rounded-xl cursor-pointer ${
                    tab !== "friends" ? "" : "backdrop-blur-md shadow-md"
                  }`}
                >
                  Friends
                </button>

                <button
                  onClick={() => setTab("video/chat")}
                  className={`w-full rounded-xl cursor-pointer ${
                    tab !== "video/chat" ? "" : "backdrop-blur-md shadow-md"
                  }`}
                >
                  Video / Chat
                </button>
              </div>

              <TabContent
                tab={tab}
                isGameStarted={isGameStarted}
                createGame={createGame}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabContent({
  tab,
  isGameStarted,
  createGame,
}: {
  tab: string;
  isGameStarted: boolean;
  createGame: () => void;
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const moves = useGameInfoStore((state) => state.moves);

  if (tab === "new") {
    if (isGameStarted) {
      return (
        <div className="w-full bg-white">
          <div className="w-full flex">
            <div className="w-full flex justify-center">White</div>
            <div className="w-full flex justify-center">Black</div>
          </div>
          <div className="w-full">
            {Array.from({ length: Math.ceil(moves.length / 2) }).map(
              (_, idx) => {
                const whiteMove = moves[idx * 2];
                const blackMove = moves[idx * 2 + 1];

                return (
                  <div key={idx} className="flex bg-green-300 p-2">
                    <div className="w-8">{idx + 1}</div>
                    <Move whiteMove={whiteMove} blackMove={blackMove} />
                  </div>
                );
              }
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`${isGameStarted ? "hidden" : "block"}`}>
        <div className="flex justify-center h-[60px] px-[10px] w-full rounded-md">
          <select className="w-full backdrop-blur-md shadow-md rounded-xl hover:outline-none">
            <option className="flex w-full justify-center">
              3 | 2 (Blitz)
            </option>
            <option>5 | 2 (Blitz)</option>
            <option>10 | 0 (Rapid)</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (!isDisabled) createGame();
            setIsDisabled(true);
          }}
          disabled={isDisabled}
          className={`h-[50px] w-[160px] bg-[#788d97] rounded-full text-white disabled:cursor-progress`}
        >
          Play
        </button>
      </div>
    );
  }

  if (tab == "friends") {
    return <div></div>;
  }

  return <div>
    
  </div>;
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
      className="h-[200px] w-[360px] rounded-xl object-cover"
    />
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
