import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "@repo/utils";
import { ViewersManager } from "./ViewersManager";
import { randomUUID } from "crypto";
import { User } from "./UserManager";
import { db } from "./db";
import { sendJsonMessage } from "./Helper";
export class Game {
  public id: string;
  public player1: User;
  public player2: User;
  public board: Chess;
  public gameId: string;
  public startDate: Date;
  public moves: { from: string; to: string }[];
  public viewersManager: ViewersManager;

  constructor(player1: User, player2: User, viewersManager: ViewersManager) {
    this.id = randomUUID();
    this.gameId = randomUUID();
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startDate = new Date();
    this.moves = [];
    this.viewersManager = viewersManager;

    this.player1.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "w",
          gameId: this.id,
        },
        opponentInfo: {
          username: this.player2.username,
          rating: this.player2.rating,
        },
      })
    );

    this.player2.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "b",
          gameId: this.id,
        },
        opponentInfo: {
          username: this.player1.username,
          rating: this.player1.rating,
        },
      })
    );

    this.newGameInDB();
  }

  private async newGameInDB() {
    const player1 = this.player1;
    const player2 = this.player2;

    try {
      const game = await db.game.create({
        data: {
          whiteUserId: player1.userId,
          blackUserId: player2.userId,
          status: "ACTIVE",
          timeControl: "RAPID",
        },
      });
      this.gameId = game.id;
    } catch (e) {
      sendJsonMessage(player1.socket, {
        ErrorMessage: "Error while creating Game",
      });

      sendJsonMessage(player2.socket, {
        ErrorMessage: "Error while creating Game",
      });
    }
  }

  makeMove(player: WebSocket, move: { from: string; to: string }) {
    const turn = this.board.turn();

    if (
      (turn === "w" && player !== this.player1.socket) ||
      (turn === "b" && player !== this.player2.socket)
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

    const opponent =
      player === this.player1.socket ? this.player2 : this.player1;

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "b" : "w";

      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: { winner, move },
      });

      player.send(gameOverMessage);
      opponent.socket.send(gameOverMessage);

      this.viewersManager.broadCast(this.id, gameOverMessage);
      this.newMoveInDB(move);
      
      return;
    }

    const moveMessage = JSON.stringify({
      type: MOVE,
      payload: move,
    });

    opponent.socket.send(moveMessage);

    this.newMoveInDB(move);
    this.viewersManager.broadCast(this.id, moveMessage);
  }

  private async newMoveInDB({ from, to }: { from: string; to: string }) {
    const gameId = this.gameId;
    const moveNumber = this.moves.length + 1;

    await db.move.create({
      data: {
        gameId: gameId,
        from: from,
        to: to,
        moveNumber: moveNumber,
      },
    });

    await db.game.update({
      where: {
        id: this.gameId,
      },
      data: {
        currentPosition: this.board.fen(),
      },
    });
  }
}
