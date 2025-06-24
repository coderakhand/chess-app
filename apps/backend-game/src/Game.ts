import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, moveType } from "@repo/utils";
import { ViewersManager } from "./ViewersManager";
import { randomUUID } from "crypto";
import { User } from "./UserManager";
import { db } from "./db";
import { sendJsonMessage } from "./Helper";
import { timeControlType } from "@repo/utils";
import { GameStatus } from "@prisma/client";
export class Game {
  public id: string;
  public player1: User;
  public player2: User;
  public board: Chess;
  public gameId: string;
  public startDate: Date;
  public prevTime: number;
  public moves: { from: string; to: string }[];
  public timeControl: timeControlType;
  public viewersManager: ViewersManager;

  constructor(
    player1: User,
    player2: User,
    timeControl: timeControlType,
    viewersManager: ViewersManager
  ) {
    this.id = randomUUID();
    this.gameId = randomUUID();
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startDate = new Date();
    this.prevTime = Date.now();
    this.moves = [];
    this.viewersManager = viewersManager;
    this.timeControl = {
      name: timeControl.name,
      baseTime: timeControl.baseTime,
      increment: timeControl.increment,
    };

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
    const timeControl = this.timeControl;

    try {
      const game = await db.game.create({
        data: {
          whiteUserId: player1.userId,
          blackUserId: player2.userId,
          status: "ACTIVE",
          timeControl: timeControl.name,
          baseTime: timeControl.baseTime,
          increment: timeControl.increment,
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

      return;
    }
  }

  makeMove(player: WebSocket, move: moveType) {
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
      this.moves.push(move);
    } catch (e) {
      player.send("invalid move");
      return;
    }

    const opponent =
      player === this.player1.socket ? this.player2 : this.player1;

    const you = this.player1 === opponent ? this.player2 : this.player1;

    const moveTime = Date.now();
    const timeTaken = moveTime - this.prevTime;
    you.timeLeft = you.timeLeft - timeTaken <= 0 ? 0 : you.timeLeft - timeTaken;
    this.prevTime = moveTime;

    let gameStatus: GameStatus = GameStatus.ACTIVE;

    if (you.timeLeft === 0) {
      gameStatus = GameStatus.TIME_UP;
    } else if (this.board.isGameOver()) {
      gameStatus = GameStatus.OVER;
    }

    if (gameStatus !== GameStatus.ACTIVE) {
      const winner = this.board.isDraw()
        ? "draw"
        : this.board.turn() === "w"
          ? "b"
          : "w";

      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner,
          move,
          time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
        },
      });

      player.send(gameOverMessage);

      opponent.socket.send(gameOverMessage);

      this.viewersManager.broadCast(this.id, gameOverMessage);
      this.newMoveInDB(move, timeTaken, gameStatus);
      return;
    }

    const moveMessage = JSON.stringify({
      type: MOVE,
      payload: {
        move: move,
        time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
      },
    });

    opponent.socket.send(moveMessage);

    this.viewersManager.broadCast(this.id, moveMessage);

    this.newMoveInDB(move, timeTaken, gameStatus);
  }

  private async newMoveInDB(
    { from, to }: moveType,
    timeTaken: number,
    gameStatus: GameStatus
  ) {
    const gameId = this.gameId;
    const moveNumber = this.moves.length + 1;

    await db.move.create({
      data: {
        gameId: gameId,
        from: from,
        to: to,
        moveNumber: moveNumber,
        timeTaken: timeTaken,
      },
    });

    await db.game.update({
      where: {
        id: this.gameId,
      },
      data: {
        currentPosition: this.board.fen(),
        status: gameStatus,
      },
    });
  }
}
