import { useState } from "react";
import type { Square, PieceSymbol, Color } from "chess.js";
import {
  DragOverlay,
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

  const setMove = useGameInfoStore((state) => state.setMove);
  const gameStatus = useGameInfoStore((state) => state.gameStatus);

  const [validMovesForPiece, setValidMovesForPiece] = useState<string[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const flipBoard = useGameInfoStore((state) => state.flipBoard);

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
      console.log(validMoves);
      setValidMovesForPiece(validMoves);
    } else {
      if (source == cellCode) {
        setSource(null);
        setValidMovesForPiece([]);
        return;
      }

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
      let m;
      try {
        m = chess.move(move);
      } catch {
        return;
      }
      setValidMovesForPiece([]);

      setBoard(chess.board());
      setMove({
        ...move,
        isCapture: m.isCapture() || m.isEnPassant(),
        piece: m.piece,
        after: m.after,
        before: m.before,
        isKingsideCastle: m.isKingsideCastle(),
        isQueensideCastle: m.isQueensideCastle(),
        isPromotion: m.isPromotion(),
      });

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
    setActiveDragId(null);
    if (!to || from === to) return;
    if (color === null || color !== chess.turn()) return;
    const move = { from, to };
    let m;
    try {
      m = chess.move(move);
    } catch {
      console.log("Invalid");
      return;
    }
    setBoard(chess.board());
    if (socket === null) return;
    setMove({
      ...move,
      isCapture: m.isCapture() || m.isEnPassant(),
      piece: m.piece,
      after: m.after,
      before: m.before,
      isKingsideCastle: m.isKingsideCastle(),
      isQueensideCastle: m.isQueensideCastle(),
      isPromotion: m.isPromotion(),
    });

    socket.send(
      JSON.stringify({
        type: "move",
        payload: {
          move: move,
        },
      })
    );
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

  const getSquareFromId = (id: string) => {
    const file = id.charAt(0);
    const rank = id.charAt(1);
    const rowIndex = 8 - parseInt(rank, 10);
    const colIndex = file.charCodeAt(0) - "a".charCodeAt(0);
    return board[rowIndex]?.[colIndex] ?? null;
  };

  const isCastleValidMove = (value: string, cellCode: string) => {
    if (value == "O-O") {
      if (color == "w" && cellCode == "g1") return true;
      if (color == "b" && cellCode == "g8") return true;
    } else if (value == "O-O-O") {
      if (color == "w" && cellCode == "c1") return true;
      if (color == "b" && cellCode == "c8") return true;
    }
    return false;
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={(e) => setActiveDragId(e.active.id as string)}
      modifiers={[restrictToFirstScrollableAncestor]}
      sensors={sensors}
    >
      <div
        className={`${
          flipBoard ? "rotate-180" : ""
        } relative touch-none ${customClass ?? " aspect-square max-w-[min(90vh,580px)]"} grid grid-rows-8 rounded-md overflow-hidden`}
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
                      (value) =>
                        value.slice(-2) === cellCode ||
                        ((value === "O-O" || value === "O-O-O") &&
                          isCastleValidMove(value, cellCode))
                    ) &&
                      (chess.get(cellCode as Square) ? (
                        <div className="absolute h-full w-full bg-red-600  opacity-60"></div>
                      ) : (
                        <div
                          className={`absolute lg:h-5 lg:w-5 rounded-full bg-radial-[at_25%_25%] from-[#4A4847]/60 to-zinc-900 to-75% opacity-30`}
                        ></div>
                      ))}
                  </DroppableSquare>
                );
              })}
            </div>
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragId ? (
          <ChessPiece
            square={getSquareFromId(activeDragId)}
            color={color}
            id={activeDragId}
            customClass="rotate-360 w-[60px]"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
