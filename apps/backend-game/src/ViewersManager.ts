import WebSocket from "ws";
import { randomUUID } from "crypto";
import { VIEWERS_CHAT } from "@repo/types";

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
  private viewers: Viewer[];
  private interestedViewers: Map<string, Viewer[]>; // gameId -> viewers[]
  private static instance: ViewersManager;

  private constructor() {
    this.viewers = [];
    this.interestedViewers = new Map<string, Viewer[]>();
  }

  public static getInstance() {
    if (ViewersManager.instance) {
      return ViewersManager.instance;
    }

    ViewersManager.instance = new ViewersManager();
    return ViewersManager.instance;
  }

  public addViewer(gameId: string, newViewer: Viewer) {
    this.viewers.push(newViewer);
    const viewers = this.interestedViewers.get(gameId) || [];
    this.interestedViewers.set(gameId, [...viewers, newViewer]);
  }

  public removeViewer(viewerSocket: WebSocket) {
    for (const [gameId, viewers] of this.interestedViewers.entries()) {
      const filteredViewers = viewers.filter(
        (viewer) => viewer.socket !== viewerSocket
      );
      this.interestedViewers.set(gameId, filteredViewers);
    }
  }

  public broadCast(gameId: string, message: string) {
    const viewers = this.interestedViewers.get(gameId);
    if (!viewers) return;

    viewers.forEach((viewer) => {
      viewer.socket.send(message);
    });
  }

  public handleChatMessage(
    gameId: string,
    senderSocket: WebSocket,
    chatMessage: string
  ) {
    const sender = this.viewers.find((viewer) => viewer.socket == senderSocket);
    if (!sender) return;
    const msg = JSON.stringify({
      type: VIEWERS_CHAT,
      payload: {
        senderInfo: {
          id: sender.id,
          username: sender.username,
        },
        message: chatMessage,
      },
    });

    this.broadCast(gameId, msg);
  }
}
