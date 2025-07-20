import express from "express";
import { db } from "../db";

const router = express.Router();

router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const game = await db.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        moves: { orderBy: { moveNumber: "asc" } },
        whiteUser: { select: { username: true } },
        blackUser: { select: { username: true } },
      },
    });

    if (!game) {
      res.status(403).json({ success: true, message: "No such game found" });
      return;
    }

    const moves = game.moves.map((move) => {
      return {
        from: move.from,
        to: move.to,
        timeTaken: move.timeTaken,
      };
    });

    res.json({
      success: true,
      game: {
        id: game.id,
        timeControl: {
          name: game.timeControl,
          baseTime: game.baseTime,
          increment: game.increment,
        },
        whitePlayer: {
          username: game.whiteUser,
          rating: game.whitePlayerRating,
          ratingChange: game.whiteUserRatingChange,
        },
        blackPlayer: {
          username: game.blackUser,
          rating: game.whitePlayerRating,
          ratingChange: game.blackUserRatingChange,
        },
        moves: moves,
        result: game.result,
      },
    });

    return;
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching Game" });
    return;
  }
});

export default router;
