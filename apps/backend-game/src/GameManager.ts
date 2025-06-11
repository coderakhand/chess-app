import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "@repo/utils";
import { UserManager, User } from "./UserManager";

export class GameManager {
  public games: Game[];
  public pendingGameId: string | null;
  public users: User[];

  constructor() {
    this.games = [];
    this.pendingGameId = null;
    this.users = [];
  }

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket);
    if (!user) {
      console.error("User not found?");
      return;
    }
    this.users = this.users.filter((user) => user.socket !== socket);
    UserManager.removeUser(user);
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((g) => g.gameId !== gameId);
  }

  private addHandler(user: User) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type == INIT_GAME) {
        if (this.pendingGameId !== null) {
          const game = this.games.find((x) => x.gameId === this.pendingGameId);
          if (!game) {
            console.error("Pending game not found?");
            return;
          }
          if (user.userId === game.player1UserId) {
            UserManager.broadcast(
              game.gameId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            return;
          }
          UserManager.addUser(user, game.gameId);
          await game?.updateSecondPlayer(user.userId);
          this.pendingGameId = null;
        } else {
          const game = new Game(user.userId, null);
          this.games.push(game);
          this.pendingGameId = game.gameId;
          UserManager.addUser(user, game.gameId);
          UserManager.broadcast(
            game.gameId,
            JSON.stringify({
              type: GAME_ADDED,
              gameId: game.gameId,
            })
          );
        }
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
