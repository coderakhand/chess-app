import { create } from "zustand";
import { boardColorsList } from "../config";
import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";
import { type moveType, type UserInfo } from "@repo/types";
interface BoardStoreType {
  darkSquare: string;
  lightSquare: string;
  pieces: string;
  setDarkSquare: (newDarkSquare: string) => void;
  setLightSquare: (newLightSquare: string) => void;
  setPieces: (newPieces: string) => void;
}

export const useBoardStore = create<BoardStoreType>((set) => ({
  darkSquare: boardColorsList.DREAM_BLUE?.darkSquare ?? "#000000",
  lightSquare: boardColorsList.DREAM_BLUE?.lightSquare ?? "#FFFFFF",
  pieces: "normal",
  setDarkSquare: (newDarkSquare: string) => set({ darkSquare: newDarkSquare }),
  setLightSquare: (newLightSquare: string) =>
    set({ lightSquare: newLightSquare }),
  setPieces: (newPieces: string) => set({ pieces: newPieces }),
}));

interface RecentGame {
  id: string;
  opponent: string;
  result: "win" | "loss" | "draw";
  timeControl: "bullet" | "blitz" | "rapid";
  rating: number;
  moves: number;
  duration: string;
  date: string;
}

interface UserInfoStoreType {
  userInfo: UserInfo;
  setUserInfo: (newUserInfo: UserInfo) => void;

  recentGames: RecentGame[];
  setRecentGames: (games: RecentGame[]) => void;
}

export const useUserInfoStore = create<UserInfoStoreType>((set) => ({
  userInfo: {
    isGuest: true,
    id: null,
    username:
      "Guest" + Math.round(Number(Math.random().toPrecision(6)) * 1000000),
    email: "",
    ratings: {
      bullet: 800,
      rapid: 800,
      blitz: 800,
    },
  },
  recentGames: [],
  setUserInfo: (newUserInfo: UserInfo) => set({ userInfo: newUserInfo }),
  setRecentGames: (games: RecentGame[]) => set({ recentGames: games }),
}));

interface timeControlType {
  name: string;
  baseTime: number;
  increment: number;
}

interface gameInfoStoreType {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  gameStatus: string | null;
  moves: moveType[];
  color: string;
  userInfo: { username: string; rating: number };
  opponentInfo: { username: string; rating: number };
  timeControl: timeControlType;
  opponentTimeLeft: number | null;
  timeLeft: number | null;
  gameCreationTime: number | null;
  result: { winner: string | null; reason: string };
  showPositionAtMovesIndex: number | null;
  flipBoard: boolean;
  setChess: (newChess: Chess) => void;
  setBoard: (
    newBoard: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => void;
  setGameStatus: (newGameStatus: string) => void;
  setMove: (newMove: moveType) => void;
  setMoves: (newMoves: moveType[]) => void;
  setColor: (newColor: string) => void;
  setOpponentInfo: (newOpponentInfo: {
    username: string;
    rating: number;
  }) => void;
  setUserInfo: (newUserInfo: { username: string; rating: number }) => void;
  setTimeControl: (newTimeControl: timeControlType) => void;
  setOpponentTimeLeft: (newOpponentTimeLeft: number) => void;
  setTimeLeft: (newTimeLeft: number) => void;
  setGameCreationTime: (newGameCreationTime: number) => void;
  setResult: (newResult: { winner: string | null; reason: string }) => void;
  setShowPositionAtMovesIndex: (newIndex: number | null) => void;
  showPositionAtMovesIndexDecrease: () => void;
  showPositionAtMovesIndexIncrease: () => void;
  setFlipBoard: (newFlipValue: boolean) => void;
  toggleFlipBoard: () => void;
}

export const useGameInfoStore = create<gameInfoStoreType>((set) => ({
  chess: new Chess(),
  board: new Chess().board(),
  gameStatus: null,
  moves: [],
  color: "w",
  opponentInfo: { username: "Opponent", rating: 800 },
  timeControl: { name: "BULLET", baseTime: 1 * 60 * 1000, increment: 2 * 1000 },
  opponentTimeLeft: 1 * 60 * 1000,
  timeLeft: 1 * 60 * 1000,
  gameCreationTime: null,
  result: { winner: null, reason: "" },
  userInfo: { username: "Guest", rating: 800 },
  showPositionAtMovesIndex: null,
  flipBoard: false,

  setChess: (newChess: Chess) => set({ chess: newChess }),

  setBoard: (
    newBoard: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => set({ board: newBoard }),

  setGameStatus: (newGameStatus: string) => set({ gameStatus: newGameStatus }),

  setMove: (newMove: moveType) =>
    set((state) => {
      const newIdx = state.moves.length;
      return {
        moves: [...state.moves, newMove],
        showPositionAtMovesIndex: newIdx,
      };
    }),

  setMoves: (newMoves: moveType[]) => set({ moves: newMoves }),

  setColor: (newColor: string) => set({ color: newColor }),

  setUserInfo: (newUserInfo: { username: string; rating: number }) =>
    set({ userInfo: newUserInfo }),

  setOpponentInfo: (newOpponentInfo: { username: string; rating: number }) =>
    set({ opponentInfo: newOpponentInfo }),

  setTimeControl: (newTimeControl: timeControlType) =>
    set({ timeControl: newTimeControl }),

  setOpponentTimeLeft: (newOpponentTimeLeft: number) =>
    set({ opponentTimeLeft: newOpponentTimeLeft }),

  setTimeLeft: (newTimeLeft: number) => set({ timeLeft: newTimeLeft }),

  setGameCreationTime: (newGameCreationTime: number) =>
    set({ gameCreationTime: newGameCreationTime }),

  setResult: (newResult: { winner: string | null; reason: string }) =>
    set({ result: newResult }),

  setShowPositionAtMovesIndex: (newIndex) =>
    set({ showPositionAtMovesIndex: newIndex }),

  showPositionAtMovesIndexDecrease: () =>
    set((state) => {
      const newIdx =
        state.showPositionAtMovesIndex !== null &&
        state.showPositionAtMovesIndex > 0
          ? state.showPositionAtMovesIndex - 1
          : state.showPositionAtMovesIndex;
      const chess = new Chess(state.moves[newIdx || 0]?.after);
      return {
        showPositionAtMovesIndex: newIdx,
        board: chess.board(),
      };
    }),

  showPositionAtMovesIndexIncrease: () =>
    set((state) => {
      const newIdx =
        state.showPositionAtMovesIndex !== null &&
        state.showPositionAtMovesIndex < state.moves.length - 1
          ? state.showPositionAtMovesIndex + 1
          : state.showPositionAtMovesIndex;

      const chess = new Chess(state.moves[newIdx || 0]?.after);
      return {
        showPositionAtMovesIndex: newIdx,
        board: chess.board(),
      };
    }),

  setFlipBoard: (newFlipValue: boolean) => set({ flipBoard: newFlipValue }),
  toggleFlipBoard: () => set((state) => ({ flipBoard: !state.flipBoard })),
}));

interface UserSettingsType {
  showBoardCoordinates: boolean;
  setShowBoardCoordinates: (newShowBoardCoordiantes: boolean) => void;
}

export const useUserSettings = create<UserSettingsType>((set) => ({
  showBoardCoordinates: false,
  setShowBoardCoordinates: (newShowBoardCoordiantes: boolean) =>
    set({ showBoardCoordinates: newShowBoardCoordiantes }),
}));
