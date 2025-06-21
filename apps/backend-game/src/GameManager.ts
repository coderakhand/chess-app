import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE, INIT_VIEW_GAME } from "@repo/utils";
import { Viewer, ViewersManager } from "./ViewersManager";

export class GameManager {
  public games: Game[];
  public pendingPlayer: WebSocket | null;
  public users: WebSocket[];
  public viewersManager: ViewersManager;

  constructor() {
    this.games = [];
    this.pendingPlayer = null;
    this.users = [];
    this.viewersManager = new ViewersManager();
  }

  addPlayer(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removePlayer(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);

    if (this.pendingPlayer === socket) {
      this.pendingPlayer = null;
    }

    this.games = this.games.filter(
      (game) => game.player1 !== socket && game.player2 !== socket
    );
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type == INIT_GAME) {
        if (this.pendingPlayer !== null) {
          const game = new Game(
            this.pendingPlayer,
            socket,
            this.viewersManager
          );
          this.games.push(game);
          this.pendingPlayer = null;
          console.log("Game started:", game.id);
        } else {
          this.pendingPlayer = socket;
          console.log("Player waiting...");
        }
        return;
      }

      if (message.type == MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.payload);
        }
        return;
      }

      if (message.type == INIT_VIEW_GAME) {
        const gameId = message.payload.gameId;
        const viewer = new Viewer(message.payload.username, socket);
        this.viewersManager.addViewer(gameId, viewer);

        console.log(`Viewer ${viewer.username} joined game ${gameId}`);
      }
    });
  }
}
