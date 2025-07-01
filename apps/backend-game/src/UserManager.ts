import { randomUUID } from "crypto";
import type WebSocket from "ws";

export class User {
  public isGuest: boolean;
  public id: string;
  public username: string;
  public rating: number;
  public socket: WebSocket | null;
  public timeLeft: number;

  constructor(
    isGuest: boolean,
    id: string | null,
    username: string,
    rating: number,
    socket: WebSocket | null,
    timeLeft: number
  ) {
    this.isGuest = isGuest;
    this.id = isGuest ? randomUUID() : (id ?? randomUUID());
    this.username = username;
    this.rating = rating;
    this.socket = socket;
    this.timeLeft = timeLeft;
  }
}
