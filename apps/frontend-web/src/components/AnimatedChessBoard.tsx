import { useEffect, useState } from "react";
import { sampleGame } from "../config"; // assume it's an array of { from, to }
import { useBoardStore, useGameInfoStore } from "../store/atoms";
import ChessPiece from "./ChessPiece";
import { Chess } from "chess.js";
import { motion } from "motion/react";
import DroppableSquare from "./DroppableSquare";
interface AnimatedChessBoardProps {
  customClass?: string;
  customClassPieces?: string;
}

export default function AnimatedChessBoard({
  customClass,
  customClassPieces,
}: AnimatedChessBoardProps) {
  const color = useGameInfoStore((state) => state.color);
  const lightSquare = useBoardStore((state) => state.lightSquare);
  const darkSquare = useBoardStore((state) => state.darkSquare);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const setFlipBoard = useGameInfoStore((state) => state.setFlipBoard);
  const setMove = useGameInfoStore((state) => state.setMove);
  const setMoves = useGameInfoStore((state) => state.setMoves);
  const setShowPositionAtMovesIndex = useGameInfoStore(
    (state) => state.setShowPositionAtMovesIndex
  );

  useEffect(() => {
    setTimeout(() => {}, 300);
    setFlipBoard(false);

    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= sampleGame.length) {
        const newChess = new Chess();
        setChess(newChess);
        setBoard(newChess.board());
        idx = 0;
        setShowPositionAtMovesIndex(null);
        setMoves([]);
        return;
      }
      const m = chess.move(sampleGame[idx] || "");
      setMove({ from: m.from, to: m.to });
      setBoard(chess.board());
      idx++;
    }, 1000);

    return () => {
      clearInterval(interval);
      setShowPositionAtMovesIndex(null);
      setMoves([]);
    };
  }, [
    setBoard,
    setChess,
    setMove,
    setMoves,
    chess,
    setFlipBoard,
    setShowPositionAtMovesIndex,
  ]);

  return (
    <motion.div
      className={`relative ${customClass ?? "w-[600px] h-[600px]"} grid grid-rows-8 rounded-md overflow-hidden`}
    >
      {board.map((row, i) => {
        return (
          <div key={i} className="grid grid-cols-8">
            {row.map((square, j) => {
              const cellCode = String.fromCharCode(97 + (j % 8)) + (8 - i);

              return (
                <DroppableSquare
                  key={j}
                  id={cellCode}
                  onClick={() => {}}
                  color={(i + j) % 2 !== 0 ? darkSquare : lightSquare}
                >
                  {square !== null ? (
                    <ChessPiece
                      square={square}
                      color={color}
                      id={cellCode}
                      customClass={customClassPieces}
                    />
                  ) : (
                    <></>
                  )}
                </DroppableSquare>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
}
