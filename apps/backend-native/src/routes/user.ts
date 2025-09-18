import express from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { TimeControl } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "cat";

router.get("/me", requireAuth, (req, res) => {
  const user = req.user as any;
  const authToken = jwt.sign(
    {
      isGuest: false,
      id: user.id,
      username: user.username,
      ratings: {
        bullet: user.bulletRating,
        blitz: user.blitzRating,
        rapid: user.rapidRating,
      },
    },
    JWT_SECRET,
    { expiresIn: "28d" }
  );

  res.json({
    authToken: authToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      ratings: {
        bullet: user.bulletRating,
        blitz: user.blitzRating,
        rapid: user.rapidRating,
      },
    },
  });
});

router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await db.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(403).json({ success: true, message: "No such user found" });
      return;
    }

    const gameStats = async (timeControl: TimeControl) => {
      const games = await db.game.findMany({
        where: {
          timeControl: timeControl,
          OR: [{ whiteUserId: user.id }, { blackUserId: user.id }],
        },
        orderBy: { createdAt: "desc" },
      });

      const totalGames = games.length;
      let wins = 0,
        losses = 0,
        draws = 0;

      const ratingHistory = [];

      for (const game of games) {
        let userColor: "w" | "b" = "w",
          rating = 0;

        if (user.id == game.whiteUserId) {
          rating =
            Number(game.whiteUserRatingChange) +
            Number(game.whiteUserRatingChange);
          userColor = "w";
        } else {
          rating =
            Number(game.blackPlayerRating) + Number(game.blackUserRatingChange);
          userColor = "b";
        }

        if (game.status == "OVER") {
          if (ratingHistory.length < 20) {
            const info = {
              gameDate: game.createdAt,
              rating: rating,
            };
            ratingHistory.push(info);
          }

          if (game.result === "DRAW") {
            draws++;
          } else {
            if (userColor == "w" && game.result === "WHITE_WINS") {
              wins++;
            } else {
              losses++;
            }
          }
        }
      }

      const winRate =
        totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

      return { ratingHistory, totalGames, wins, losses, draws, winRate };
    };

    const [bulletStats, blitzStats, rapidStats] = await Promise.all([
      gameStats("BULLET"),
      gameStats("BLITZ"),
      gameStats("RAPID"),
    ]);

    const totalGames =
      bulletStats.totalGames + rapidStats.totalGames + blitzStats.totalGames;

    res.json({
      user: {
        username: username,
        totalGames: totalGames,
        bulletStats: {
          currentRating: user.bulletRating,
          peakRating: user.peakBulletRating,
          otherStats: bulletStats,
        },
        blitzStats: {
          currentRating: user.blitzRating,
          peakRating: user.peakBlitzRating,
          otherStats: blitzStats,
        },
        rapidStats: {
          currentRating: user.rapidRating,
          peakRating: user.peakRapidRating,
          otherStats: rapidStats,
        },
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user information." });
    return;
  }
});

router.post("/games/:username", async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.body.offset || 0);
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      res.status(403).json({ success: true, message: "No such user found" });
      return;
    }

    const games = await db.game.findMany({
      where: {
        OR: [{ whiteUserId: user.id }, { blackUserId: user.id }],
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: 10,
      include: {
        _count: {
          select: { moves: true },
        },
        whiteUser: { select: { username: true } },
        blackUser: { select: { username: true } },
      },
    });

    res.json({
      success: true,
      games: games.map((game) => {
        let opponentUsername, rating;

        if (game.whiteUser?.username == username) {
          rating =
            Number(game.whitePlayerRating) + Number(game.whiteUserRatingChange);
          opponentUsername = game.blackUser?.username;
        } else {
          rating =
            Number(game.blackPlayerRating) + Number(game.blackUserRatingChange);
          opponentUsername = game.whiteUser?.username;
        }
        return {
          id: game.id,
          opponent: opponentUsername,
          rating: rating,
          timeControl: game.timeControl,
          result: game.result,
          date: game.createdAt,
          moves: game._count.moves,
        };
      }),
    });

    return;
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user information." });
    return;
  }
});

export default router;
