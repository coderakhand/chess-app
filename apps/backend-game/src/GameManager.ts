import WebSocket from "ws";
import { Game } from "./Game";
import {
  ERROR,
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
  initGameSchema,
  moveSchema,
  drawOfferSchema,
  drawAnswerSchema,
  playerChatSchema,
  initViewGameSchema,
  resignGameSchema,
  type UserInfo,
  TimeControl,
  VIEWERS_CHAT,
} from "@repo/types";
import { Viewer, ViewersManager } from "./ViewersManager";
import { User } from "./UserManager";
import { db } from "./db";
import { GameStatus } from "@prisma/client";
import jwt from "jsonwebtoken";

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
  private static instance: GameManager | null = null;

  public constructor() {
    this.games = [];
    this.pendingUsers = [];
    this.users = [];
  }

  public static getInstance() {
    if (GameManager.instance) {
      return GameManager.instance;
    }
    GameManager.instance = new GameManager();

    return GameManager.instance;
  }

  public addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  public removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    ViewersManager.getInstance().removeViewer(socket);

    this.pendingUsers = this.pendingUsers.filter(
      (pendingUser) => pendingUser.user.socket != socket
    );
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
        const res = initGameSchema.safeParse(message);

        if (!res.success) {
          console.log(message);
          console.log(res);
          this.handleError(socket, "Invalid schema");
          return;
        }

        console.log(message);
        const { authToken, isRated, timeControl } = message.payload;
        console.log(authToken);
        const userInfoViaMessage = message.payload.userInfo;
        let userInfo;
        console.log("secret =>", process.env.JWT_SECRET);

        if (!userInfoViaMessage.isGuest) {
          try {
            const decodedPayload = jwt.verify(
              authToken,
              process.env.JWT_SECRET || "cat"
            ) as UserInfo;

            const ratings = decodedPayload.ratings;

            const rating =
              timeControl.name == TimeControl.BLITZ
                ? ratings.blitz
                : timeControl.name == TimeControl.BULLET
                  ? ratings.bullet
                  : ratings.rapid;

            userInfo = {
              isGuest: decodedPayload.isGuest,
              id: decodedPayload.id,
              username: decodedPayload.username,
              rating: rating,
            };
          } catch (err) {
            console.error("JWT verification failed:", err);
            this.handleError(socket, "Unauthorized Access");
            return;
          }
        } else {
          userInfo = userInfoViaMessage;
        }

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
          const game = new Game(user, opponent, isRated, timeControl);

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
        const { success } = moveSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }

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
        const { success } = resignGameSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }

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
        const { success } = drawOfferSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }

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
        const { success } = drawAnswerSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }
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
        const { success } = playerChatSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }
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
        const { success } = initViewGameSchema.safeParse(message);
        if (!success) {
          this.handleError(socket, "Invalid schema");
          return;
        }

        const gameId = message.payload.gameId;

        const viewer = new Viewer(message.payload.username, socket);

        ViewersManager.getInstance().addViewer(gameId, viewer);

        console.log(`Viewer ${viewer.username} joined game ${gameId}`);
      }

      if (message.type == VIEWERS_CHAT) {
        const gameId = message.payload.gameId;
        const chatMessage = message.payload.message;
        ViewersManager.getInstance().handleChatMessage(
          gameId,
          socket,
          chatMessage
        );
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
            lastActiveGame.currentPosition,
            movesList
          )
        : new Game(
            opponentUser,
            playerUser,
            //@ts-ignore
            timeControl,
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

  private handleError(socket: WebSocket, error: string) {
    socket.send(
      JSON.stringify({
        type: ERROR,
        payload: {
          error: error,
        },
      })
    );
  }
}
