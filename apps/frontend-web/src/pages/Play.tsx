import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME, GAME_OVER, MOVE } from "../config";
import { Chess } from "chess.js";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import {winnerAtom} from '../store/atoms';

export default function Play() {
  const socket = useSocket();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [tab, setTab] = useState("new");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [color, setColor] = useState<string | null>(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      switch (message.type) {
        case INIT_GAME: {
          setChess(new Chess());
          setBoard(chess.board());
          setColor(message.payload.color);
          setIsGameStarted(true);
          break;
        }
        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
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
  }, [socket, chess]);

  if (socket === null) {
    return <div className="min-h-screen text-white">Loading....</div>;
  }

  const createGame = () => {
    socket.send(JSON.stringify({ type: INIT_GAME }));
  };

  return (
    <div className="flex min-w-screen min-h-screen lg:h-screen  gap-[100px]">
      <SideBar position={"fixed"} />
      <div className="flex justify-center min-w-screen py-[30px] gap-3">
        <div className="flex flex-col gap-2">
          <PlayerCard player={"Opponent"} />
          <ChessBoard
            socket={socket}
            chess={chess}
            winner={winner}
            board={board}
            setBoard={setBoard}
            setChess={setChess}
            color={color}
          />
          <PlayerCard player={"You"} />
        </div>
        <div className="flex flex-col h-screen w-[400px] gap-3">
          <div className="w-full px-[20px] h-[200px]">
            {" "}
            <div className="h-[200px] w-[360px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40">
              {" "}
              Opponent Video
            </div>
          </div>
          <div className="flex justify-center w-full h-[250px] ">
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
                  onClick={() => setTab("games")}
                  className={`w-full rounded-xl cursor-pointer ${
                    tab !== "myVideo" ? "" : "backdrop-blur-md shadow-md"
                  }`}
                >
                  Games
                </button>
                <button
                  onClick={() => setTab("friends")}
                  className={`w-full rounded-xl cursor-pointer ${
                    tab !== "friends" ? "" : "backdrop-blur-md shadow-md"
                  }`}
                >
                  Friends
                </button>
              </div>
              <CustomComponent
                tab={tab}
                isGameStarted={isGameStarted}
                createGame={createGame}
              />
            </div>
          </div>
          <div className="w-full px-[20px] h-[200px]">
            <div className="h-[200px] w-[360px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40">
              Your Video
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomComponent({
  tab,
  isGameStarted,
  createGame,
}: {
  tab: string;
  isGameStarted: boolean;
  createGame: () => void;
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  if (tab === "new") {
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

  if (tab == "games") {
    return <div></div>;
  }

  return <div></div>;
}

function PlayerCard({ player }: { player: string }) {
  return (
    <div className="flex items-center w-full h-[40px]">
      <div className=" flex-grow px-[5px] h-full flex items-center gap-2">
        <img src="/chezz.png" alt="" className="w-[30px]" />
        <div>GM</div>
        <div>{player} </div>
        <div>2500</div>
      </div>
      <div className="flex justify-end items-center px-[5px] h-[40px] w-[120px] text-white bg-[#070f24] rounded-lg text-3xl">
        5:00
      </div>
    </div>
  );
}
