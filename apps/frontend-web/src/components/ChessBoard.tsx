import { useState } from "react";
import type { Square, PieceSymbol, Color } from "chess.js";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { useBoardStore, useGameInfoStore } from "../store/atoms";
import ChessPiece from "./ChessPiece";
import GameResultCard from "./GameResultCard";
import DroppableSquare from "./DroppableSquare";

interface ChessBoardProps {
  socket: WebSocket | null;
  customClass?: string;
  customClassPieces?: string;
}

export default function ChessBoard({
  socket,
  customClass,
  customClassPieces,
}: ChessBoardProps) {
  const color = useGameInfoStore((state) => state.color);
  const chess = useGameInfoStore((state) => state.chess);
  const board = useGameInfoStore((state) => state.board);
  const setBoard = useGameInfoStore((state) => state.setBoard);
  const lightSquare = useBoardStore((state) => state.lightSquare);
  const darkSquare = useBoardStore((state) => state.darkSquare);

  const [source, setSource] = useState<string | null>(null);

  const setMoves = useGameInfoStore((state) => state.setMoves);
  const gameStatus = useGameInfoStore((state) => state.gameStatus);

  const handleMovement = (
    i: number,
    j: number,
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    const cellCode = String.fromCharCode(97 + (j % 8)) + (8 - i);
    if (source === null) {
      if (square === null) return;
      if (square.color != color) return;
      setSource(cellCode);
    } else {
      if (socket === null) {
        setSource(null);
        return;
      }

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

      setMoves(move);

      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: move,
          },
        })
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const from = event.active.id as string;
    const to = event.over?.id as string;
    if (!to || from === to) return;
    if (color === null || color !== chess.turn()) return;
    const move = { from, to };

    if (chess.move(move)) {
      setBoard(chess.board());
      if (socket === null) return;
      setMoves(move);
      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: move,
          },
        })
      );
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
        } relative ${customClass ?? " aspect-square max-w-[min(90vh,580px)]"} grid grid-rows-8 rounded-md overflow-hidden`}
      >
        {gameStatus === "OVER" ? <GameResultCard /> : <></>}
        {board.map((row, i) => {
          return (
            <div key={i} className="grid grid-cols-8">
              {row.map((square, j) => {
                const cellCode = String.fromCharCode(97 + (j % 8)) + (8 - i);

                return (
                  <DroppableSquare
                    key={j}
                    id={cellCode}
                    onClick={() => handleMovement(i, j, square)}
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
