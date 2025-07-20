import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { fen, depth } = req.body;
  try {
    const result = await axios.get("https://stockfish.online/api/s/v2.php", {
      params: { fen, depth },
    });
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Stockfish failed" });
  }
});

export default router;
