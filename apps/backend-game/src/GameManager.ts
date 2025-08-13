import WebSocket from "ws";
import { Game } from "./Game";
import {
  INIT_GAME,
  MOVE,
  INIT_VIEW_GAME,
  PENDING_GAME,
  timeControlType,
  GAME_OVER,
  DRAW_OFFER,
  DRAW_ANSWER,
  PLAYER_CHAT,
  ABANDON_GAME,
  RESIGN_GAME,
} from "@repo/utils";
import { Viewer, ViewersManager } from "./ViewersManager";
import { User } from "./UserManager";
import { db } from "./db";
import { GameStatus } from "@prisma/client";

export class GameManager {
  public games: Game[];
  public pendingUsers: {
    gameInfo: {
      isRated: boolean;
      timeControl: {
        name: string;
        baseTime: number;
        increment: number;
      };
    };
    user: User;
  }[];
  public users: WebSocket[];
  public viewersManager: ViewersManager;

  constructor() {
    this.games = [];
    this.pendingUsers = [];
    this.users = [];
    this.viewersManager = new ViewersManager();
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    this.viewersManager.removeViewer(socket);

    const game = this.games.find(
      (game) => game.player1.socket === socket && game.player2.socket === socket
    );

    if (game) {
      if (game.player1.socket === socket) {
        game.player1.socket = null;
      } else {
        game.player2.socket = null;
      }

      if (game.player1 === null && game.player2 === null) {
        this.games = this.games.filter((g) => g.id !== game.id);
      }
    }
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.id !== gameId);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());

      if (message.type == INIT_GAME) {
        const { userInfo, isRated, timeControl } = message.payload;
        console.log(message.payload);
        const user = new User(
          userInfo.isGuest,
          userInfo.id,
          userInfo.username,
          userInfo.rating,
          socket,
          timeControl.baseTime
        );

        if (!user.isGuest) {
          const isPendingGame = await this.handlePendingGame(user);
          if (isPendingGame) {
            return;
          }
        } else {
          this.abandonGame(socket);
        }

        const waitingOpponent = this.pendingUsers.find(
          (pendingUser) =>
            pendingUser.user.isGuest === user.isGuest &&
            pendingUser.gameInfo.isRated === isRated &&
            pendingUser.gameInfo.timeControl.baseTime ===
              timeControl.baseTime &&
            pendingUser.gameInfo.timeControl.increment === timeControl.increment
        );

        if (waitingOpponent) {
          const opponent = waitingOpponent.user;
          const game = new Game(
            user,
            opponent,
            isRated,
            timeControl,
            this.viewersManager
          );

          this.games.push(game);

          this.pendingUsers = this.pendingUsers.filter(
            (pendingUser) => pendingUser !== waitingOpponent
          );

          console.log(
            `Game Started b/w ${user.username} & ${waitingOpponent.user.username}`
          );
        } else {
          this.pendingUsers.push({
            gameInfo: {
              isRated: isRated,
              timeControl: timeControl,
            },
            user: user,
          });
          console.log(`${user.username} is waiting`);
        }
        return;
      }

      if (message.type == MOVE) {
        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );

        if (game) {
          game.makeMove(socket, message.payload.move);
        }
        return;
      }

      if (message.type == RESIGN_GAME) {
        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );

        if (game) {
          game.resignGame(socket);
        }
        return;
      }

      if (message.type == DRAW_OFFER) {
        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );

        if (game) {
          game.drawOffer(socket);
        }
        return;
      }

      if (message.type == DRAW_ANSWER) {
        const isAccepted = message.payload.isAccepted || false;

        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );

        if (game) {
          game.drawAnswer(socket, isAccepted);
        }

        return;
      }

      if (message.type == PLAYER_CHAT) {
        const chatMessage = message.payload.message;
        const game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );

        if (game) {
          game.sendChatMessage(socket, chatMessage);
        }
        return;
      }

      if (message.type == ABANDON_GAME) {
        this.abandonGame(socket);
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

  private async handlePendingGame(user: User) {
    const existingGame = this.games.find(
      (game) => game.player1.id === user.id || game.player2.id === user.id
    );

    if (existingGame) {
      this.restoreSocket(existingGame, user);
      return;
    }

    try {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        include: {
          gamesAsWhite: true,
          gamesAsBlack: true,
        },
      });

      if (!dbUser) return;

      const allGames = [
        ...dbUser.gamesAsWhite.map((g) => ({ ...g, isWhite: true })),
        ...dbUser.gamesAsBlack.map((g) => ({ ...g, isWhite: false })),
      ];

      const lastActiveGame = allGames
        .filter((g) => g.status === GameStatus.ACTIVE)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      if (!lastActiveGame) return false;

      const opponentId = lastActiveGame.isWhite
        ? lastActiveGame.blackUserId
        : lastActiveGame.whiteUserId;

      if (!opponentId) return false;

      const opponent = await db.user.findUnique({
        where: { id: opponentId },
      });

      if (!opponent) return false;

      const timeControl = {
        name: lastActiveGame.timeControl,
        baseTime: lastActiveGame.baseTime,
        increment: lastActiveGame.increment,
      };

      const {
        userTimeLeft,
        opponentTimeLeft,
        movesList,
      } = //@ts-ignore
        await this.calculateTimeAndMoves(lastActiveGame.id, timeControl);

      const rating =
        timeControl.name === "BLITZ"
          ? "blitzRating"
          : timeControl.name === "BULLET"
            ? "bulletRating"
            : "rapidRating";

      const playerUser = new User(
        user.isGuest,
        user.id,
        user.username,
        dbUser[rating],
        user.socket,
        userTimeLeft
      );

      const opponentUser = new User(
        false,
        opponent.id,
        opponent.username,
        opponent[rating],
        null,
        opponentTimeLeft
      );

      const game = lastActiveGame.isWhite
        ? new Game(
            playerUser,
            opponentUser,
            //@ts-ignore
            timeControl,
            this.viewersManager,
            lastActiveGame.currentPosition,
            movesList
          )
        : new Game(
            opponentUser,
            playerUser,
            //@ts-ignore
            timeControl,
            this.viewersManager,
            lastActiveGame.currentPosition,
            movesList
          );

      user.socket?.send(
        JSON.stringify({
          type: PENDING_GAME,
          payload: {
            position: game.board.fen(),
            timeControl: timeControl,
            userInfo: {
              color: lastActiveGame.isWhite ? "w" : "b",
              timeLeft: playerUser.timeLeft,
            },
            opponentInfo: {
              username: opponentUser.username,
              rating: opponentUser.rating,
              timeLeft: opponentUser.timeLeft,
            },
          },
        })
      );

      this.games.push(game);
      return true;
    } catch (err) {
      user.socket?.send(
        JSON.stringify({
          type: "ERROR",
          message: "Unable to search database. Retry.",
        })
      );
      return false;
    }
  }

  private restoreSocket(game: Game, user: User) {
    let playerUser, opponentUser;
    if (game.player1.id === user.id) {
      game.player1 = user;
      playerUser = game.player1;
      opponentUser = game.player2;
    } else {
      game.player2 = user;
      playerUser = game.player2;
      opponentUser = game.player1;
    }

    const color = game.player1.id === user.id ? "w" : "b";

    user.socket?.send(
      JSON.stringify({
        type: PENDING_GAME,
        payload: {
          position: game.board.fen(),
          timeControl: game.timeControl,
          userInfo: {
            color: color,
            timeLeft: playerUser.timeLeft,
          },
          opponentInfo: {
            username: opponentUser.username,
            rating: opponentUser.rating,
            timeLeft: opponentUser.timeLeft,
          },
        },
      })
    );
  }

  private async calculateTimeAndMoves(
    gameId: string,
    timeControl: timeControlType
  ) {
    const moves = await db.move.findMany({
      where: { gameId },
      orderBy: { moveNumber: "asc" },
    });

    let userTimeLeft = timeControl.baseTime ?? 0;
    let opponentTimeLeft = timeControl.baseTime ?? 0;

    const movesList = moves.map((move, idx) => {
      const isWhiteMove = idx % 2 === 0;
      const timeTaken = move.timeTaken ?? 0;

      if (isWhiteMove) {
        opponentTimeLeft -= timeTaken;
        opponentTimeLeft += timeControl.increment ?? 0;
      } else {
        userTimeLeft -= timeTaken;
        userTimeLeft += timeControl.increment ?? 0;
      }

      return {
        from: move.from,
        to: move.to,
      };
    });

    return { userTimeLeft, opponentTimeLeft, movesList };
  }

  private abandonGame(socket: WebSocket) {
    const waitingOpponent = this.pendingUsers.find(
      (pendingUser) => pendingUser.user.socket === socket
    );

    this.pendingUsers = this.pendingUsers.filter(
      (pendingUser) => pendingUser !== waitingOpponent
    );

    const game = this.games.find(
      (game) => game.player1.socket === socket || game.player2.socket === socket
    );

    if (game) {
      let user, opponent;
      let winner;
      if (socket === game.player1.socket) {
        user = game.player1;
        opponent = game.player2;
        winner = "b";
      } else {
        user = game.player2;
        opponent = game.player1;
        winner = "w";
      }

      if (opponent.socket) {
        opponent.socket.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner: winner,
              reason: "Win by Opponent Left",
            },
          })
        );
      }
      this.removeGame(game.id);
    }
  }
}
