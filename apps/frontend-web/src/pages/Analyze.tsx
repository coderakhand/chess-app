import { DndContext, DragOverlay, type DragEndEvent } from "@dnd-kit/core";
import SideBar from "../components/SideBar";
import DroppableSquare from "../components/DroppableSquare";
import ChessPiece from "../components/ChessPiece";
import { useEffect, useState } from "react";
import { Chess, type PieceSymbol, type Square, type Color } from "chess.js";
import { useBoardStore } from "../store/atoms";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import axios from "axios";
import api from "../api/axios";
import EvaluationBar from "../components/EvaluationBar";

export default function Analyze() {
  const [color, setColor] = useState<"w" | "b">("w");
  const lightSquare = useBoardStore((state) => state.lightSquare);
  const darkSquare = useBoardStore((state) => state.darkSquare);
  const [source, setSource] = useState<string | null>(null);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [evalScore, setEvalScore] = useState(50);
  const [mateScore, setMateScore] = useState(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleMovement = (
    cellCode: string,
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    if (source === null) {
      if (square === null || square.color !== chess.turn()) return;
      setSource(cellCode);
    } else {
      const move = { from: source, to: cellCode };
      setSource(null);
      try {
        chess.move(move);
        setBoard(chess.board());
      } catch {
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const from = event.active.id as string;
    const to = event.over?.id as string;
    setActiveDragId(null);
    if (!to || from === to) return;

    const move = { from, to };
    if (chess.move(move)) {
      setBoard(chess.board());
    }
  };

  useEffect(() => {
    const fetchEngine = async () => {
      try {
        const { data: csrf } = await api.get("/csrf-token");
        const response = await axios.post(
          `http://localhost:3000/engine`,
          {
            fen: chess.fen(),
            depth: 10,
          },
          { headers: { "csrf-token": csrf.csrfToken } }
        );
        const data = response.data;
        setEvalScore(data.evaluation);
        setMateScore(data.mate);
      } catch (e) {
        console.log(e);
      }
    };

    fetchEngine();
  }, [board, chess]);

  const getSquareFromId = (id: string) => {
    const file = id.charAt(0);
    const rank = id.charAt(1);
    const rowIndex = 8 - parseInt(rank, 10);
    const colIndex = file.charCodeAt(0) - "a".charCodeAt(0);
    return board[rowIndex]?.[colIndex] ?? null;
  };

  return (
    <div className="min-h-screen min-w-screen flex  items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]">
      <SideBar />

      <div className="flex w-full h-full max-w-screen-xl justify-center items-center px-4 gap-4">
        <EvaluationBar evalScore={evalScore} mateScore={mateScore} />
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={(e) => setActiveDragId(e.active.id as string)}
          modifiers={[restrictToFirstScrollableAncestor]}
        >
          <div
            className={`${
              color === "b" ? "rotate-180" : ""
            } relative w-[600px] h-[600px] max-w-[580px] max-h-[580px] grid grid-rows-8 rounded-md`}
          >
            {board.map((row, i) => (
              <div key={i} className="grid grid-cols-8">
                {row.map((square, j) => {
                  const cellCode =
                    String.fromCharCode(97 + j) + (8 - i).toString();

                  return (
                    <DroppableSquare
                      key={cellCode}
                      id={cellCode}
                      onClick={() => handleMovement(cellCode, square)}
                      color={(i + j) % 2 !== 0 ? darkSquare : lightSquare}
                    >
                      {square ? (
                        <ChessPiece
                          square={square}
                          color={color}
                          id={cellCode}
                        />
                      ) : null}
                    </DroppableSquare>
                  );
                })}
              </div>
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDragId ? (
              <ChessPiece
                square={getSquareFromId(activeDragId)}
                color={color}
                id={activeDragId}
                customClass="w-[60px] object-contain pointer-events-none"
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
