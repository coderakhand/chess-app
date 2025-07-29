import * as cheerio from "cheerio";
import { FidePlayer } from "@repo/utils";

const convertHtmlToJson = (html: string) => {
  try {
    const $ = cheerio.load(html);

    const players: FidePlayer[] = [];
    $(".top_recors_table tr").each((i, row) => {
      if (i === 0) return;

      const cells = $(row).find("td");
      if (cells.length < 5) return;

      const link = $(cells[1]).find("a");
      const name = link.text().trim();

      const fedCell = $(cells[2]);
      const fedImgSrc = fedCell.find("img").attr("src") || "";

      const fedAvrMatch = fedImgSrc.match(/\/([^\/]+)\.svg$/);
      const flagAbbreviation = fedAvrMatch ? fedAvrMatch[1] : "";
      const federation = fedCell.text().replace(/\s+/g, " ").trim();

      const rating = parseInt($(cells[3]).text(), 10);
      const birthYear = parseInt($(cells[4]).text(), 10);

      players.push({
        rank: parseInt($(cells[0]).text(), 10),
        name,
        federation,
        flagAbbreviation: flagAbbreviation || "",
        rating,
        birthYear,
      });
    });
    return players;
  } catch (e) {
    return [];
  }
};

export default convertHtmlToJson;
