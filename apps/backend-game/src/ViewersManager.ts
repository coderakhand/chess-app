import WebSocket from "ws";
import { randomUUID } from "crypto";

export class Viewer {
  public id: string;
  public username: string;
  public socket: WebSocket;

  constructor(username: string, socket: WebSocket) {
    this.id = randomUUID();
    this.username = username;
    this.socket = socket;
  }
}

export class ViewersManager {
  private interestedViewers: Map<string, Viewer[]>; // gameId -> viewers[]

  constructor() {
    this.interestedViewers = new Map<string, Viewer[]>();
  }

  addViewer(gameId: string, newViewer: Viewer) {
    const viewers = this.interestedViewers.get(gameId) || [];
    this.interestedViewers.set(gameId, [...viewers, newViewer]);
  }

  removeViewer(gameId: string, viewerId: string) {
    const viewers =
      this.interestedViewers
        .get(gameId)
        ?.filter((viewer) => viewer.id !== viewerId) || [];
    this.interestedViewers.set(gameId, viewers);
  }

  broadCast(gameId: string, message: string) {
    const viewers = this.interestedViewers.get(gameId);
    if (!viewers) return;

    viewers.forEach((viewer) => {
      viewer.socket.send(message);
    });
  }
}
