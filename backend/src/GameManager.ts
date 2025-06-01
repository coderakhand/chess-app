import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  public games: Game[];
  public pendingPlayer: WebSocket | null;
  public players: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingPlayer = null;
    this.players = [];
  }

  addPlayer(socket: WebSocket) {
    this.players.push(socket);
    this.addHandler(socket);
  }

  removePlayer(socket: WebSocket) {
    this.players = this.players.filter((user) => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type == INIT_GAME) {
        if (this.pendingPlayer !== null) {
          const game = new Game(this.pendingPlayer, socket);
          this.games.push(game);
          this.pendingPlayer = null;
          console.log(this.games);
          console.log("game started");
        } else {
          this.pendingPlayer = socket;
          console.log("player waiting");
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
    });
  }
}
