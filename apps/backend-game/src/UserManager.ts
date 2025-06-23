import { randomUUID } from "crypto";
import type WebSocket from "ws";

export class User {
  public id: string;
  public userId: string;
  public username: string;
  public rating: number;
  public socket: WebSocket;
  public timeLeft: number;

  constructor(
    userId: string,
    username: string,
    rating: number,
    socket: WebSocket,
    timeLeft: number
  ) {
    this.id = randomUUID();
    this.userId = userId;
    this.username = username;
    this.rating = rating;
    this.timeLeft = timeLeft;
    this.socket = socket;
  }
}
