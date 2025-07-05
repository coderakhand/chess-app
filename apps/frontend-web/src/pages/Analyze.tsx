import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import SideBar from "../components/SideBar";
import DroppableSquare from "../components/DroppableSquare";
import ChessPiece from "../components/ChessPiece";
import { useState } from "react";
import { Chess, type PieceSymbol, type Square, type Color } from "chess.js";
import { useBoardStore } from "../store/atoms";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

export default function Analyze() {
  const [color, setColor] = useState("w");

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]">
      <SideBar position="absolute" />
      <div className="">
        <AnalysisChessBoard color={color} />
        <div className=""></div>
      </div>
    </div>
  );
}

interface AnalysisChessBoardProps {
  color: string;
  customClass?: string;
  customClassPieces?: string;
}

function AnalysisChessBoard({
  color,
  customClass,
  customClassPieces,
}: AnalysisChessBoardProps) {
  const lightSquare = useBoardStore((state) => state.lightSquare);
  const darkSquare = useBoardStore((state) => state.darkSquare);
  const [source, setSource] = useState<string | null>(null);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  const handleMovement = (
    cellCode: string,
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    if (source === null) {
      if (square === null) return;
      if (color !== chess.turn()) return;
      setSource(cellCode);
    } else {
      const move = {
        from: source,
        to: cellCode,
      };

      setSource(null);
      try {
        chess.move(move);
      } catch {
        return;
      }

      setBoard(chess.board());
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const from = event.active.id as string;
    const to = event.over?.id as string;
    if (!to || from === to) return;
    if (color !== chess.turn()) return;
    const move = { from, to };

    if (chess.move(move)) {
      setBoard(chess.board());
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToFirstScrollableAncestor]}
    >
      <div
        className={`${
          color !== null ? (color === "b" ? "rotate-180" : "") : ""
        } relative ${customClass ?? "w-[600px] h-[600px] max-w-[580px] max-h-[580px]"} grid grid-rows-8 rounded-md overflow-hidden`}
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
                    onClick={() => handleMovement(cellCode, square)}
                    color={(i + j) % 2 !== 0 ? darkSquare : lightSquare}
                  >
                    {square !== null ? (
                      <ChessPiece
                        square={square}
                        color={color}
                        id={cellCode}
                        customClass={customClassPieces}
                      />
                    ) : null}
                  </DroppableSquare>
                );
              })}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
