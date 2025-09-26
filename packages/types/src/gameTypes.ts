import { PieceSymbol } from "chess.js";

export enum TimeControl {
  CLASSICAL = "CLASSICAL",
  RAPID = "RAPID",
  BLITZ = "BLITZ",
  BULLET = "BULLET",
  CUSTOM = "CUSTOM",
}

export interface timeControlType {
  name: TimeControl | null;
  baseTime: number | null;
  increment: number | null;
}

export interface moveType {
  from: string;
  to: string;
  promotion?: PieceSymbol;
  before?: string;
  after?: string;
  timeTaken?: number;
  isCapture?: boolean;
  piece?: PieceSymbol;
  isKingsideCastle?: boolean;
  isQueensideCastle?: boolean;
  isPromotion?: boolean;
}

export enum GameStatus {
  ACTIVE = "ACTIVE",
  OVER = "OVER",
  PLAYER_LEFT = "PLAYER_LEFT",
  ABANDONED = "ABANDONED",
  TIME_UP = "TIME_UP",
}
