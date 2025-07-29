import axios from "axios";
import express from "express";
import convertHtmlToJson from "../utils/convertHtmlToJson";

const router = express.Router();

// @ts-ignore
router.get("/ratings/:q", async (req, res) => {
  const q = req.params.q;
  try {
    const response = await axios.get(
      `https://ratings.fide.com/a_top.php?list=${q}`
    );
    const data = response.data;
    const players = convertHtmlToJson(data);
    return res.json({ players });
  } catch (e) {
    return res.json({
      message: "Unable to fetch data",
    });
  }
});

export default router;
