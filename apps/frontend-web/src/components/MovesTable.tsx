import { useGameInfoStore } from "../store/atoms";
import { GiChessQueen, GiChessRook, GiChessKing } from "react-icons/gi";
import { FaChessBishop, FaChessKnight } from "react-icons/fa6";
import { useEffect } from "react";
import type { moveType } from "@repo/utils";
import { Chess } from "chess.js";

export default function MovesTable() {
  const moves = useGameInfoStore((state) => state.moves);

  return (
    <div className="w-full">
      {/* <div className="w-full grid grid-cols-2">
        <div className="w-full flex justify-center">White</div>
        <div className="w-full flex justify-center">Black</div>
      </div> */}
      <div className="w-full">
        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, idx) => {
          const whiteMove = moves[idx * 2];
          const blackMove = moves[idx * 2 + 1];

          return (
            <div
              key={idx}
              className={`flex items-center p-2 h-6 ${idx % 2 == 0 ? "shadow-sm border-white/20 border-1" : "backdrop-blur-2xl"}`}
            >
              <div className="w-8 text-xs font-extrabold font-proza dark:text-[#A1A1AA]">
                {idx + 1}
              </div>
              <Move
                whiteMove={{
                  idx: idx * 2,
                  move: whiteMove,
                }}
                blackMove={{
                  idx: idx * 2 + 1,
                  move: blackMove,
                }}
              />
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
  whiteMove?: { idx: number; move: moveType | undefined };
  blackMove?: { idx: number; move: moveType | undefined };
}) {
  const showPositionAtMovesIndex = useGameInfoStore(
    (state) => state.showPositionAtMovesIndex
  );
  const setShowPositionAtMovesIndex = useGameInfoStore(
    (state) => state.setShowPositionAtMovesIndex
  );
  const moves = useGameInfoStore((state) => state.moves);
  const setBoard = useGameInfoStore((state) => state.setBoard);

  const refinedMove = (move: moveType) => {
    if (move.isKingsideCastle) {
      return <p>O-O</p>;
    } else if (move.isQueensideCastle) {
      return <p>O-O-O</p>;
    }

    let pieceElement = null;

    switch (move.piece) {
      case "q":
        pieceElement = <GiChessQueen />;
        break;
      case "b":
        pieceElement = <FaChessBishop />;
        break;
      case "k":
        pieceElement = <GiChessKing />;
        break;
      case "n":
        pieceElement = <FaChessKnight />;
        break;
      case "r":
        pieceElement = <GiChessRook />;
        break;
    }

    if (pieceElement == null) {
      if (move.isCapture) {
        return (
          <>
            <p>{`${move.from[0]}x${move.to}`}</p>
          </>
        );
      }
      return (
        <>
          <p>{move.to}</p>
        </>
      );
    }

    return (
      <>
        {pieceElement}
        <p>
          {move.isCapture ? "x" : ""} {move.to}
        </p>
      </>
    );
  };

  const setPositionIndex = (idx: number | undefined) => {
    if (idx == undefined || idx >= moves.length - 1) {
      setShowPositionAtMovesIndex(moves.length - 1);
      return;
    }
    const chess = new Chess(moves[idx]?.after);

    setBoard(chess.board());
    setShowPositionAtMovesIndex(idx);
  };

  useEffect(() => {
    if (showPositionAtMovesIndex == null) setShowPositionAtMovesIndex(0);
  });

  return (
    <div className="flex items-center gap-12 font-proza text-sm dark:text-[#A1A1AA]">
      <div
        className="w-22 text-center cursor-pointer"
        onClick={() => setPositionIndex(whiteMove?.idx)}
      >
        <div
          className={`max-w-14 flex items-center justify-center rounded-lg overflow-hidden ${whiteMove && showPositionAtMovesIndex == whiteMove.idx ? "bg-white/30 shadow-xl dark:bg-slate-600" : ""}`}
        >
          {whiteMove && whiteMove.move && refinedMove(whiteMove.move)}
        </div>
      </div>
      <div
        className="w-22 text-center cursor-pointer"
        onClick={() => setPositionIndex(blackMove?.idx)}
      >
        <div
          className={`max-w-14 flex items-center justify-center rounded-lg overflow-hidden ${blackMove && showPositionAtMovesIndex == blackMove.idx ? "bg-white/30 shadow-xl dark:bg-slate-600" : ""}`}
        >
          {blackMove && blackMove.move && refinedMove(blackMove.move)}
        </div>
      </div>
    </div>
  );
}
