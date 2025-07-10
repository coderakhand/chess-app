import { useState } from "react";
import type { Square, PieceSymbol, Color } from "chess.js";
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
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

  const [validMovesForPiece, setValidMovesForPiece] = useState<string[]>([]);

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
      const validMoves = chess.moves({ square: cellCode as Square });
      setValidMovesForPiece(validMoves);
    } else {
      if (square && square.color == color) {
        setSource(cellCode);
        const validMoves = chess.moves({ square: cellCode as Square });
        setValidMovesForPiece(validMoves);
        return;
      }

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
      setValidMovesForPiece([]);

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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 2,
    },
  });

  const sensors = useSensors(pointerSensor, mouseSensor, touchSensor);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToFirstScrollableAncestor]}
      sensors={sensors}
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
                    onClick={() => {
                      handleMovement(i, j, square);
                    }}
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

                    {validMovesForPiece.find(
                      (value) => value.slice(-2) === cellCode
                    ) && (
                      <div
                        className={`${chess.get(cellCode as Square) ? "absolute h-full w-full border-6 border-[#4A4847] rounded-full opacity-60 z-100" : "h-5 w-5 bg-[#4A4847] rounded-full opacity-30"}`}
                      />
                    )}
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
