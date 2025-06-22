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

  removeViewer(viewerSocket: WebSocket) {
    for (const [gameId, viewers] of this.interestedViewers.entries()) {
      const filteredViewers = viewers.filter(
        (viewer) => viewer.socket !== viewerSocket
      );
      this.interestedViewers.set(gameId, filteredViewers);
    }
  }

  broadCast(gameId: string, message: string) {
    const viewers = this.interestedViewers.get(gameId);
    if (!viewers) return;

    viewers.forEach((viewer) => {
      viewer.socket.send(message);
    });
  }
}
