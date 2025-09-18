import WebSocket from "ws";
import { Chess } from "chess.js";
import {
  DRAW_ANSWER,
  DRAW_OFFER,
  GAME_OVER,
  MOVE,
  moveType,
  PLAYER_CHAT,
  TIME_UPDATE,
} from "@repo/types";
import { ViewersManager } from "./ViewersManager";
import { randomUUID } from "crypto";
import { User } from "./UserManager";
import { db } from "./db";
import { INIT_GAME, timeControlType } from "@repo/types";
import { GameResult, GameStatus } from "@prisma/client";
import { GameManager } from "./GameManager";

type PlayerKey = "player1" | "player2";
export class Game {
  public id: string;
  public player1: User;
  public player2: User;
  public isRated: boolean;
  public timeControl: timeControlType;
  public board: Chess;
  public startDate: Date;
  public lastMoveTime: number;
  public moves: moveType[];
  public gameStatus: GameStatus;
  public drawAgreement: {
    player: PlayerKey | null;
    move: number;
  } = {
    player: null,
    move: 0,
  };
  private timer: NodeJS.Timeout | null;

  constructor(
    player1: User,
    player2: User,
    isRated: boolean,
    timeControl: timeControlType,
    position?: string,
    moves?: moveType[]
  ) {
    this.id = randomUUID();
    this.player1 = player1;
    this.player2 = player2;
    this.isRated = isRated;
    this.startDate = new Date();
    this.lastMoveTime = Date.now();
    this.timeControl = timeControl;
    this.board = !position ? new Chess() : new Chess(position);
    this.moves = !moves ? [] : moves;
    this.gameStatus = GameStatus.ACTIVE;

    if (!position) {
      this.createNewGame();
    }

    this.timer = setInterval(() => {
      let gameResult: boolean = false,
        winner: string | null = null;
      const timePassedSinceLastMove = Date.now() - this.lastMoveTime;
      console.log("timePassed => ", timePassedSinceLastMove);
      if (this.board.turn() == "w") {
        if (timePassedSinceLastMove >= this.player1.timeLeft) {
          this.player1.timeLeft = 0;
          gameResult = true;
          this.gameStatus = GameStatus.TIME_UP;
          winner = "b";
        }
      } else {
        if (timePassedSinceLastMove >= this.player2.timeLeft) {
          this.player2.timeLeft = 0;
          gameResult = true;
          this.gameStatus = GameStatus.TIME_UP;
          winner = "w";
        }
      }
      if (gameResult) {
        if (this.timer) clearInterval(this.timer);
        this.player1.socket?.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner: winner,
              reason: "Win on Time",
              time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            },
          })
        );
        this.player2.socket?.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner: winner,
              reason: "Win on Time",
              time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            },
          })
        );

        if (!this.player1.isGuest && !this.player2.isGuest) {
          this.storeGameResultInDB(winner);
        }
      }
    }, 1000);
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
            whitePlayerRating: player1.rating,
            blackPlayerRating: player2.rating,
            status: GameStatus.ACTIVE,
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

  public makeMove(socket: WebSocket, move: moveType) {
    let { user, opponent } = this.findUserAndOpponent(socket);

    if (this.isNotSocketTurn(socket)) return;

    const thisMoveTime = Date.now();

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

    console.log(`${this[user].username} made the move`);

    const timeTaken = thisMoveTime - this.lastMoveTime;
    this[user].timeLeft = this[user].timeLeft - timeTaken;
    this.lastMoveTime = thisMoveTime;

    if (this[user].timeLeft > 0) {
      this[user].timeLeft += Number(this.timeControl.increment);
      const sendTime = Date.now();
      this[user].socket?.send(
        JSON.stringify({
          type: TIME_UPDATE,
          payload: {
            sendTime: sendTime,
            time: {
              w: this.player1.timeLeft,
              b: this.player2.timeLeft,
            },
          },
        })
      );
      console.log(`updated time send to ${this[user].username}`);

      this[opponent].socket?.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
            sendTime: sendTime,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
          },
        })
      );

      console.log(`move send to ${this[opponent].username}`);

      ViewersManager.getInstance().broadCast(
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
      const winner = this.board.turn();
      if (winner == "w") this.player1.timeLeft = 0;
      else this.player2.timeLeft;
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: {
          reason: "Won on Time",
          winner: winner,
          time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
        },
      });
      socket.send(gameOverMessage);
      this[opponent].socket?.send(gameOverMessage);
      ViewersManager.getInstance().broadCast(this.id, gameOverMessage);
      if (this.timer) clearInterval(this.timer);
      GameManager.getInstance().removeGame(this.id);
    }

    if (this.board.isGameOver() && this.gameStatus !== GameStatus.TIME_UP) {
      this.gameStatus = GameStatus.OVER;

      let gameOverMessage: string = "";

      if (this.board.isCheckmate()) {
        const winner = this.board.turn() === "w" ? "b" : "w";

        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: winner,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Win by Checkmate",
          },
        });
      } else if (this.board.isStalemate()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: null,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Draw by Stalemate",
          },
        });
      } else if (this.board.isDrawByFiftyMoves()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: null,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Draw by 50 Move Rule",
          },
        });
      } else if (this.board.isThreefoldRepetition()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: null,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Draw by 3 Fold Repetition",
          },
        });
      } else if (this.board.isInsufficientMaterial()) {
        gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: null,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Draw by Insufficient Material",
          },
        });
      }

      socket.send(gameOverMessage);
      this[opponent].socket?.send(gameOverMessage);
      ViewersManager.getInstance().broadCast(this.id, gameOverMessage);
      if (this.timer) clearInterval(this.timer);
      if (!this.player1.isGuest && !this.player2.isGuest)
        this.storeGameResultInDB(null);

      GameManager.getInstance().removeGame(this.id);
    }

    if (!this[user].isGuest && !this[opponent].isGuest) {
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
    const { user, opponent } = this.findUserAndOpponent(socket);
    let winner: string | null = null;
    if (socket === this.player1.socket) {
      winner = "b";
    } else {
      winner = "w";
    }

    if (this[opponent].socket) {
      this[opponent].socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: winner,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Win by Resignation",
          },
        })
      );
    }

    if (this[user].socket) {
      this[user].socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: winner,
            time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
            reason: "Win by Resignation",
          },
        })
      );
    }

    if (this.timer) clearInterval(this.timer);
    if (!this.player1.isGuest && !this.player2.isGuest)
      this.storeGameResultInDB(winner);

    GameManager.getInstance().removeGame(this.id);
  }

  private async storeGameResultInDB(winner: string | null) {
    const result = winner
      ? winner === "w"
        ? GameResult.WHITE_WINS
        : GameResult.BLACK_WINS
      : GameResult.DRAW;

    let score = 0;
    if (winner == "w") {
      score = 1;
    } else if (winner == "b") {
      score = 0;
    }

    const { newPlayer1Rating, newPlayer2Rating } = this.getNewRatings(
      this.player1.rating,
      this.player2.rating,
      score,
      32
    );

    try {
      await db.user.update({
        where: {
          username: this.player1.username,
        },data: {
          
        }
      })
    } catch(e) {
      console.log("Unable to store new rating of player1");
      return;
    }

    try {
      await db.user.update({
        where: {
          username: this.player2.username,
        }, data: {

        }
      })
    } catch(e) {
      console.log("Unable to store new rating of player2");
      return;
    }

    try {
      await db.game.update({
        where: {
          id: this.id,
        },
        data: {
          status: this.gameStatus,
          result: result,
        },
      });
    } catch (e) {
      console.log("Unable to store result in DB");
    }
  }

  public drawOffer(socket: WebSocket) {
    const { user, opponent } = this.findUserAndOpponent(socket);

    if (this.isNotSocketTurn(socket)) return;

    this.drawAgreement.player = user;
    this.drawAgreement.move = this.moves.length;

    this[opponent].socket?.send(
      JSON.stringify({
        type: DRAW_OFFER,
      })
    );
  }

  public drawAnswer(socket: WebSocket, isAccepted: boolean) {
    if (
      !this.drawAgreement.player ||
      this.drawAgreement.move !== this.moves.length
    ) {
      socket.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: "Invalid Attempt to Answer a draw Agreement",
          },
        })
      );
      return;
    }

    const { user, opponent } = this.findUserAndOpponent(socket);

    if (user !== this.drawAgreement.player) {
      if (isAccepted) {
        socket.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
              winner: null,
              reason: "Draw by Agreement",
            },
          })
        );

        this[opponent].socket?.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
              winner: null,
              reason: "Draw by Agreement",
            },
          })
        );
        if (this.timer) clearInterval(this.timer);
        if (!this.player1.isGuest && !this.player2.isGuest)
          this.storeGameResultInDB(null);

        GameManager.getInstance().removeGame(this.id);
        return;
      } else {
        this[opponent].socket?.send(
          JSON.stringify({
            type: DRAW_ANSWER,
            payload: {
              time: { w: this.player1.timeLeft, b: this.player2.timeLeft },
              winner: null,
              isAccepted: false,
            },
          })
        );
      }
    }
  }

  private getNewRatings(
    player1Rating: number,
    player2Rating: number,
    player1Score: number,
    k = 32
  ) {
    const expectedA =
      1 / (1 + Math.pow(10, (player2Rating - player1Rating) / 400));
    const expectedB = 1 - expectedA;

    const scoreB = 1 - player1Score;

    const newPlayer1Rating = Math.round(
      player1Rating + k * (player1Score - expectedA)
    );
    const newPlayer2Rating = Math.round(
      player2Rating + k * (scoreB - expectedB)
    );

    return {
      newPlayer1Rating: newPlayer1Rating,
      newPlayer2Rating: newPlayer2Rating,
    };
  }

  public sendChatMessage(socket: WebSocket, message: string) {
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
          type: PLAYER_CHAT,
          payload: {
            message: message,
          },
        })
      );
    }
  }

  private isNotSocketTurn(socket: WebSocket) {
    const { user } = this.findUserAndOpponent(socket);
    const turn = this.board.turn();

    if (
      (user === "player1" && turn !== "w") ||
      (user === "player2" && turn !== "b")
    ) {
      socket.send(
        JSON.stringify({
          type: "ERROR",
          message: "This is not your move",
        })
      );
      return true;
    }
    return false;
  }

  private findUserAndOpponent(socket: WebSocket) {
    let user: PlayerKey, opponent: PlayerKey;

    if (this.player1.socket == socket) {
      user = "player1";
      opponent = "player2";
    } else {
      user = "player2";
      opponent = "player1";
    }

    return { user, opponent };
  }
}
