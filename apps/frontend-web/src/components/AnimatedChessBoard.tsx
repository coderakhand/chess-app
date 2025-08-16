import { useEffect, useRef, useState } from "react";
import { sampleGame } from "../config"; // assume it's an array of { from, to }
import { useBoardStore, useGameInfoStore } from "../store/atoms";
import ChessPiece from "./ChessPiece";
import { Chess } from "chess.js";
import { motion } from "framer-motion";
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
  const chessRef = useRef(new Chess());
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const setFlipBoard = useGameInfoStore((state) => state.setFlipBoard);

  useEffect(() => {
    setTimeout(() => {}, 300);
    setFlipBoard(false);
    setChess(chessRef.current);
    setBoard(chessRef.current.board());

    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= sampleGame.length) {
        chessRef.current = new Chess();
        setChess(chessRef.current);
        setBoard(chessRef.current.board());
        idx = 0;
        return;
      }
      chessRef.current.move(sampleGame[idx] || "");
      setBoard(chessRef.current.board());
      idx++;
    }, 900);

    return () => clearInterval(interval);
  }, [setBoard, setChess]);

  return (
    <motion.div
      className={`relative ${customClass ?? "w-[600px] h-[600px]"} grid grid-rows-8 rounded-md overflow-hidden`}
    >
      {board.map((row, i) => (
        <div key={i} className="grid grid-cols-8">
          {row.map((square, j) => {
            const cellCode = String.fromCharCode(97 + j) + (8 - i);
            const isDark = (i + j) % 2 !== 0;
            const squareColor = isDark ? darkSquare : lightSquare;

            return (
              <div
                key={j}
                id={cellCode}
                className={`${squareColor} w-full h-full flex justify-center items-center`}
              >
                {square && (
                  <ChessPiece
                    square={square}
                    color={color}
                    id={cellCode}
                    customClass={customClassPieces}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
