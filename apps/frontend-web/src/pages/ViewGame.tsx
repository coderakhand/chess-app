import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameInfoStore } from "../store/atoms";
import api from "../api/axios";
import PlayerCard from "../components/PlayerCard";
import SideBar from "../components/SideBar";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import MovesTable from "../components/MovesTable";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Chess } from "chess.js";
import { moveType } from "@repo/types";

export default function ViewGame() {
  const socket = useSocket();
  const obj = useParams();
  const gameId = obj.id;
  const setMoves = useGameInfoStore((state) => state.setMoves);
  const setResult = useGameInfoStore((state) => state.setResult);
  const showPositionAtMovesIndex = useGameInfoStore(
    (state) => state.showPositionAtMovesIndex
  );
  const moves = useGameInfoStore((state) => state.moves);

  const opponentInfo = useGameInfoStore((state) => state.opponentInfo);
  const setOpponentInfo = useGameInfoStore((state) => state.setOpponentInfo);

  const timeControl = useGameInfoStore((state) => state.timeControl);
  const setTimeControl = useGameInfoStore((state) => state.setTimeControl);
  const [whitePlayerTime, setWhitePlayerTime] = useState<number | null>(null);
  const [blackPlayerTime, setBlackPlayerTime] = useState<number | null>(null);

  const whiteTimeLeftRef = useRef(null);
  const blackTimeLeftRef = useRef(null);

  const showPositionAtMovesIndexDecrease = useGameInfoStore(
    (state) => state.showPositionAtMovesIndexDecrease
  );

  const showPositionAtMovesIndexIncrease = useGameInfoStore(
    (state) => state.showPositionAtMovesIndexIncrease
  );

  const flipBoard = useGameInfoStore((state) => state.flipBoard);
  const setFlipBoard = useGameInfoStore((state) => state.setFlipBoard);
  const toggleFlipBoard = useGameInfoStore((state) => state.toggleFlipBoard);

  const [blackPlayer, setBlackPlayer] = useState({
    username: "hi",
    rating: 800,
    ratingChange: 0,
  });
  const [whitePlayer, setWhitePlayer] = useState({
    username: "hi",
    rating: 800,
    ratingChange: 0,
  });

  useEffect(() => {
    if (!socket) return;
  });

  useEffect(() => {
    setMoves([]);
    setFlipBoard(false);
    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/${gameId}`);
        const data = response.data;
        const game = data.game;
        if (!game) return;
        console.log(data);
        const chess = new Chess();
        setTimeControl({
          baseTime: game.timeControl.baseTime,
          increment: game.timeControl.increment,
          name: game.timeControl.name,
        });
        setWhitePlayerTime(game.timeControl.baseTime);
        setBlackPlayerTime(game.timeControl.baseTime);
        const moves = game.moves.map((move: moveType) => {
          const m = chess.move(move);
          return {
            ...move,
            piece: m.piece,
            after: m.after,
            before: m.before,
            isCapture: m.isCapture() || m.isEnPassant(),
            isKingsideCastle: m.isKingsideCastle(),
            isQueensideCastle: m.isQueensideCastle(),
            isPromotion: m.isPromotion(),
          };
        });

        setMoves(moves);
        const whitePlayer = game.whitePlayer;
        const blackPlayer = game.blackPlayer;
        setWhitePlayer({
          username: blackPlayer.username,
          rating: blackPlayer.rating,
          ratingChange: 0,
        });
        setBlackPlayer({
          username: whitePlayer.username,
          rating: whitePlayer.rating,
          ratingChange: 0,
        });
      } catch (e) {
        console.log(e);
      }
    };

    fetchGame();
  }, []);

  return (
    <div
      className={`flex max-lg:flex-col w-screen lg:h-screen  lg:gap-[100px] bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center overflow-hidden dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
    >
      <SideBar />

      <div className="flex max-lg:flex-col  max-lg:items-center justify-center w-screen min-h-screen py-[30px] gap-6 sm:pl-[60px] px-1 max-sm:px-3 max-sm:pt-[100px]">
        <div className="flex-grow max-w-[560px] flex flex-col gap-2 h-full">
          <PlayerCard
            player={flipBoard ? blackPlayer.username : whitePlayer.username}
            rating={flipBoard ? blackPlayer.rating : whitePlayer.rating}
            color={flipBoard ? "w" : "b"}
            time={flipBoard ? blackPlayerTime : whitePlayerTime}
          />

          <ChessBoard socket={socket} />

          <PlayerCard
            player={!flipBoard ? blackPlayer.username : whitePlayer.username}
            rating={!flipBoard ? blackPlayer.rating : whitePlayer.rating}
            color={!flipBoard ? "w" : "b"}
            time={!flipBoard ? blackPlayerTime : whitePlayerTime}
          />
        </div>

        <div className="flex flex-col h-full w-full  sm:w-[580px] lg:w-[400px] gap-3 md:px-10 ">
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
                      value="details"
                      className="flex justify-center items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none rounded-xl"
                    >
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="analysis"
                    className="flex-grow  bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    <div className="h-full pt-1 grid grid-rows-[80%_20%]">
                      <div className="flex flex-col">
                        <div className="flex w-full justify-center items-center"></div>

                        <div className="w-full flex items-center justify-center font-semibold font-dream dark:text-white">
                          Moves
                        </div>
                        <div className="flex-grow overflow-y-auto">
                          <MovesTable />
                        </div>
                        <div
                          onKeyDown={(event) => {
                            if (event.key === "ArrowRight")
                              showPositionAtMovesIndexIncrease();
                            if (event.key === "ArrowLeft")
                              showPositionAtMovesIndexDecrease();
                          }}
                          className=" flex items-center gap-2 dark:bg-[#7b7b7f] px-2 py-1 bg-white/40 backdrop-blur-lg shadow-xl"
                        >
                          <button className="w-8 h-8 p-1 hover:cursor-pointer">
                            <Share2 className="w-4 h-4 dark:text-white" />
                          </button>

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

                            <Button
                              size="icon"
                              onClick={toggleFlipBoard}
                              className="w-8 h-8 bg-white hover:bg-[#E2E2E2]  rounded-xl cursor-pointer"
                            >
                              <img src="/flip_board.svg" className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="details"
                    className="flex-grow px-8 py-6 bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:bg-[#18181B] dark:border-1.4 dark:border-[#27272A] overflow-hidden"
                  >
                    <div className="h-full">
                      <div className="mb-6 p-1 w-full bg-white/30 font-bold font-dream dark:text-white rounded-sm flex justify-center items-center">
                        White Wins
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold font-dream">Match: </p>
                        <p className="font-semibold font-proza text-sm">
                          {whitePlayer.username} ({whitePlayer.rating}) vs{" "}
                          {blackPlayer.username} ({blackPlayer.rating}){" "}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="font-bold font-dream">Time: </p>
                        <p className="font-semibold font-proza text-sm">
                          {`${timeControl.baseTime / 60000} | ${timeControl.increment / 1000} (${timeControl.name})`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="font-bold font-dream">Rating Changes: </p>
                        <p className="font-semibold font-proza text-sm">
                          {`white: ${whitePlayer.ratingChange} black: ${blackPlayer.ratingChange}`}
                        </p>
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
