import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "@repo/utils";
import { ViewersManager } from "./ViewersManager";
import { randomUUID } from "crypto";

export class Game {
  public id: string;
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  public startDate: Date;
  public viewersManager: ViewersManager;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    viewersManager: ViewersManager
  ) {
    this.id = randomUUID();
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startDate = new Date();
    this.viewersManager = viewersManager;

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "w",
          gameId: this.id,
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "b",
          gameId: this.id,
        },
      })
    );
  }

  makeMove(player: WebSocket, move: { from: string; to: string }) {
    const turn = this.board.turn();

    if (
      (turn === "w" && player !== this.player1) ||
      (turn === "b" && player !== this.player2)
    ) {
      player.send("not your move");
      return;
    }

    try {
      this.board.move(move);
    } catch (e) {
      player.send("invalid move");
      return;
    }

    const opponent = player === this.player1 ? this.player2 : this.player1;

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "b" : "w";

      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: { winner, move },
      });

      player.send(gameOverMessage);
      opponent.send(gameOverMessage);

      this.viewersManager.broadCast(this.id, gameOverMessage);

      return;
    }

    const moveMessage = JSON.stringify({
      type: MOVE,
      payload: move,
    });

    opponent.send(moveMessage);

    this.viewersManager.broadCast(this.id, moveMessage);
  }
}
