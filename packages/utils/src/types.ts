export enum TimeControl {
  CLASSICAL = "CLASSICAL",
  RAPID = "RAPID",
  BLITZ = "BLITZ",
  BULLET = "BULLET",
  CUSTOM = "CUSTOM",
}

export interface timeControlType {
  name: TimeControl;
  baseTime: number;
  increment: number;
}

export interface moveType {
  from: string;
  to: string;
}

export enum GameStatus {
  ACTIVE = "ACTIVE",
  OVER = "OVER",
  PLAYER_LEFT = "PLAYER_LEFT",
  ABANDONED = "ABANDONED",
  TIME_UP = "TIME_UP",
}
