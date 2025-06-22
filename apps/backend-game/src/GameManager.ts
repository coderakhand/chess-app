import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE, INIT_VIEW_GAME } from "@repo/utils";
import { Viewer, ViewersManager } from "./ViewersManager";
import { User } from "./UserManager";

export class GameManager {
  public games: Game[];
  public pendingPlayer: User | null;
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
    this.viewersManager.removeViewer(socket);
    this.pendingPlayer = null;

    this.games = this.games.filter(
      (game) => game.player1.socket !== socket && game.player2.socket !== socket
    );
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type == INIT_GAME) {
        const userInfo = message.userInfo;

        const player = new User(
          userInfo.userId,
          userInfo.username,
          userInfo.rating,
          socket
        );

        if (this.pendingPlayer !== null) {
          const game = new Game(
            this.pendingPlayer,
            player,
            this.viewersManager
          );

          this.games.push(game);

          this.pendingPlayer = null;

          console.log("Game started:", game.id);
        } else {
          this.pendingPlayer = player;

          console.log("Player waiting...");
        }
        return;
      }

      if (message.type == MOVE) {
        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
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
