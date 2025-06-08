import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "@repo/utils";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  public startDate: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startDate = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "w",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "b",
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
      opponent.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner,
            move,
          },
        })
      );

      if (opponent !== this.player1) {
        this.player1.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner },
          })
        );
      }

      if (opponent !== this.player2) {
        this.player2.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner },
          })
        );
      }

      return;
    }

    opponent.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
  }
}
