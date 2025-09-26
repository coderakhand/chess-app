import z from "zod";
import { usernameSchema } from "./AuthenticationSchema";

const registerVerifiedUsernameConnectionSchema = z.object({
  type: z.string(),
  payload: {
    authToken: z.string(),
  },
});

const initGameSchema = z.object({
  type: z.string(),
  payload: z.object({
    authToken: z.string().nullable(),
    isRated: z.boolean(),
    timeControl: z.object({
      name: z.string().nullable(),
      baseTime: z.number().nullable(),
      increment: z.number().nullable(),
    }),
    userInfo: z.object({
      isGuest: z.boolean(),
      id: z.string().nullable(),
      username: usernameSchema,
      rating: z.number(),
    }),
  }),
});

const moveSchema = z.object({
  type: z.string(),
  payload: z.object({
    move: z.object({
      from: z.string(),
      to: z.string(),
      promotion: z.string().optional(),
    }),
  }),
});

const pendingGameSchema = z.object({
  type: z.string(),
  payload: z.object({}),
});

const gameOverSchema = z.object({
  type: z.string(),
  payload: z.object({
    time: z.object({
      w: z.number(),
      b: z.number(),
    }),
    winner: z.string(),
    reason: z.string(),
  }),
});

const timeUpdateSchema = z.object({
  type: z.string(),
  payload: z.object({
    sendTime: z.number(),
    time: z.object({
      w: z.number(),
      b: z.number(),
    }),
  }),
});

const drawOfferSchema = z.object({
  type: z.string(),
});

const drawAnswerSchema = z.object({
  type: z.string(),
  payload: z.object({
    isAccepted: z.boolean(),
  }),
});

const playerChatSchema = z.object({
  type: z.string(),
  payload: z.object({
    message: z.string(),
  }),
});

const resignGameSchema = z.object({
  type: z.string(),
});

const initViewGameSchema = z.object({
  type: z.string(),
  payload: {
    username: z.string(),
    gameId: z.string(),
  },
});

const gameChallengeSchema = z.object({
  type: z.string(),
  payload: {
    authToken: z.string(),
    opponentUsername: usernameSchema,
    isRated: z.boolean(),
    timeControl: z.object({
      name: z.string() || z.null(),
      baseTime: z.number() || z.null(),
      increment: z.number() || z.null(),
    }),
  },
});

const answerGameChallengeSchema = z.object({
  type: z.string(),
  payload: {
    isAccepted: z.boolean(),
    authToken: z.string(),
    challengerName: usernameSchema,
  },
});

export {
  initGameSchema,
  moveSchema,
  pendingGameSchema,
  gameOverSchema,
  timeUpdateSchema,
  drawOfferSchema,
  drawAnswerSchema,
  playerChatSchema,
  resignGameSchema,
  initViewGameSchema,
  gameChallengeSchema,
  answerGameChallengeSchema,
  registerVerifiedUsernameConnectionSchema,
};
