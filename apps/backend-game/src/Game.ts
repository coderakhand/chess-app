import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, moveType } from "@repo/utils";
import { ViewersManager } from "./ViewersManager";
import { randomUUID } from "crypto";
import { User } from "./UserManager";
import { db } from "./db";
import { timeControlType } from "@repo/utils";
import { GameStatus } from "@prisma/client";
import { gameManager } from "./index";

type PlayerKey = "player1" | "player2";
export class Game {
  public id: string;
  public player1: User;
  public player2: User;
  public isRated: boolean;
  public timeControl: timeControlType;
  public board: Chess;
  public startDate: Date;
  public prevTime: number;
  public moves: moveType[];
  public gameStatus: GameStatus;
  public viewersManager: ViewersManager;
  public drawAgreement: {
    player: PlayerKey | null;
    move: number;
  } = {
    player: null,
    move: 0,
  };

  constructor(
    player1: User,
    player2: User,
    isRated: boolean,
    timeControl: timeControlType,
    viewersManager: ViewersManager,
    position?: string,
    moves?: moveType[]
  ) {
    this.id = randomUUID();
    this.player1 = player1;
    this.player2 = player2;
    this.isRated = isRated;
    this.startDate = new Date();
    this.prevTime = Date.now();
    this.viewersManager = viewersManager;
    this.timeControl = timeControl;
    this.board = !position ? new Chess() : new Chess(position);
    this.moves = !moves ? [] : moves;
    this.gameStatus = GameStatus.ACTIVE;

    if (!position) {
      this.createNewGame();
    }
  }

  private async createNewGame() {
    const player1 = this.player1;
    const player2 = this.player2;
    const timeControl = this.timeControl;

    if (player1.socket) {
      player1.socket.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: {
            userInfo: {
              color: "w",
            },
            opponentInfo: {
              username: player2.username,
              rating: player2.rating,
            },
          },
        })
      );
      console.log(`${player1.username} is white`);
    }

    if (player2.socket) {
      player2.socket.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: {
            userInfo: {
              color: "b",
            },
            opponentInfo: {
              username: player1.username,
              rating: player1.rating,
            },
          },
        })
      );
      console.log(`${player1.username} is black`);
    }

    if (!player1.isGuest && !player2.isGuest) {
      try {
        const game = await db.game.create({
          data: {
            whiteUserId: player1.id,
            blackUserId: player2.id,
            status: "ACTIVE",
            timeControl: timeControl.name,
            baseTime: timeControl.baseTime,
            increment: timeControl.increment,
          },
        });

        this.id = game.id;
      } catch (e) {
        if (player1.socket) {
          player1.socket.send(
            JSON.stringify({
              type: "ERROR",
              ErrorMessage: "Error while creating Game",
            })
          );
        }

        if (player2.socket) {
          player2.socket.send(
            JSON.stringify({
              type: "ERROR",
              ErrorMessage: "Error while creating Game",
            })
          );
        }
      }
    }
    return;
  }

  makeMove(socket: WebSocket, move: moveType) {
    let user, opponent;

    if (socket === this.player1.socket) {
      user = this.player1;
      opponent = this.player2;
    } else {
      user = this.player2;
      opponent = this.player1;
    }

    const turn = this.board.turn();

    if (
      (turn === "w" && socket !== this.player1.socket) ||
      (turn === "b" && socket !== this.player2.socket)
    ) {
      socket.send(
        JSON.stringify({
          type: "ERROR",
          message: "This is not your move",
        })
      );
      return;
    }

    try {
      this.board.move(move);
      this.moves.push(move);
    } catch (e) {
      socket.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid Move",
        })
      );
      return;
    }

    console.log(`${user.username} made the move`);

    const moveTime = Date.now();
    const timeTaken = moveTime - this.prevTime;
    this.prevTime = moveTime;

    if (user.timeLeft - timeTaken > 0) {
      user.timeLeft -= timeTaken;
      user.timeLeft += Number(this.timeControl.increment);

      user.socket?.send(
        JSON.stringify({
          type: "TIME_UPDATE",
          payload: {
            time: {
              w: this.player1.timeLeft,
              b: this.player2.timeLeft,
            },
          },
        })
      );
      console.log(`updated time send to ${user.username}`);

      opponent.socket?.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
          },
        })
      );

      console.log(`move send to ${opponent.username}`);

      this.viewersManager.broadCast(
        this.id,
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
          },
        })
      );
    } else {
      this.gameStatus = GameStatus.TIME_UP;
      const winner = this.board.turn() === "w" ? "b" : "w";
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: {
          reason: "Won on Time",
          winner: winner,
        },
      });
      socket.send(gameOverMessage);
      opponent.socket?.send(gameOverMessage);
      this.viewersManager.broadCast(this.id, gameOverMessage);
      gameManager.removeGame(this.id);
    }

    if (this.board.isGameOver() && this.gameStatus !== GameStatus.TIME_UP) {
      this.gameStatus = GameStatus.OVER;

      let gameOverMessage: string = "";

      if (this.board.isCheckmate()) {
        const winner = this.board.turn() === "w" ? "b" : "w";

        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            reason: "Win by Checkmate",
            winner: winner,
          },
        });
      } else if (this.board.isStalemate()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            reason: "Draw by Stalemate",
          },
        });
      } else if (this.board.isDrawByFiftyMoves()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            reason: "Draw by 50 Move Rule",
          },
        });
      } else if (this.board.isThreefoldRepetition()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            reason: "Draw by 3 Fold Repetition",
          },
        });
      } else if (this.board.isInsufficientMaterial()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            reason: "Draw by Insufficient Material",
          },
        });
      }

      socket.send(gameOverMessage);
      opponent.socket?.send(gameOverMessage);
      this.viewersManager.broadCast(this.id, gameOverMessage);
      gameManager.removeGame(this.id);
    }

    if (!user.isGuest && !opponent.isGuest) {
      this.newMoveInDB(move, timeTaken);
      console.log(`move stored in database`);
    }

    return;
  }

  private async newMoveInDB({ from, to }: moveType, timeTaken: number) {
    const moveNumber = this.moves.length;
    try {
      await db.move.create({
        data: {
          gameId: this.id,
          from: from,
          to: to,
          moveNumber: moveNumber,
          timeTaken: timeTaken,
        },
      });

      await db.game.update({
        where: {
          id: this.id,
        },
        data: {
          currentPosition: this.board.fen(),
          status: this.gameStatus,
        },
      });
    } catch (e) {
      console.log(`Unable to put move in Database`);
    }
  }

  public resignGame(socket: WebSocket) {
    let user, opponent;
    let winner;
    if (socket === this.player1.socket) {
      user = this.player1;
      opponent = this.player2;
      winner = "b";
    } else {
      user = this.player2;
      opponent = this.player1;
      winner = "w";
    }

    if (opponent.socket) {
      opponent.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: winner,
            reason: "Win by Resignation",
          },
        })
      );
    }

    if (user.socket) {
      user.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: winner,
            reason: "Win by Resignation",
          },
        })
      );
    }
  }

  public drawOffer(socket: WebSocket) {
    let user: PlayerKey, opponent: PlayerKey;
    if (this.player1.socket === socket) {
      user = "player1";
      opponent = "player2";
    } else {
      user = "player2";
      opponent = "player1";
    }

    const turn = this.board.turn();

    if (
      (user === "player1" && turn !== "w") ||
      (user === "player2" && turn !== "b")
    ) {
      return;
    }

    this.drawAgreement.player = user;

    this[opponent].socket?.send(
      JSON.stringify({
        type: "DRAW_OFFER",
      })
    );
  }

  public drawAnswer(socket: WebSocket, isAccepted: boolean) {
    if (
      this.drawAgreement.player ||
      this.drawAgreement.move !== this.moves.length
    ) {
      return;
    }
    let user: PlayerKey, opponent: PlayerKey;
    if (this.player1.socket == socket) {
      user = "player1";
      opponent = "player2";
    } else {
      user = "player2";
      opponent = "player1";
    }

    if (user !== this.drawAgreement.player) {
      if (isAccepted) {
        socket.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              reason: "Draw by Agreement",
            },
          })
        );

        this[opponent].socket?.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              reason: "Draw by Agreement",
            },
          })
        );
      } else {
        this[opponent].socket?.send(
          JSON.stringify({
            type: "DRAW_ANSWER",
            payload: {
              isAccepted: false,
            },
          })
        );
      }
    }
  }

  public chatMessage(socket: WebSocket, message: string) {
    let user, opponent;
    if (this.player1.socket === socket) {
      user = this.player1;
      opponent = this.player2;
    } else {
      user = this.player2;
      opponent = this.player1;
    }

    if (opponent.socket) {
      opponent.socket.send(
        JSON.stringify({
          type: "PLAYER_CHAT",
          payload: {
            message: message,
          },
        })
      );
    }
  }
}
