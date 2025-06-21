import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { ViewersManager } from "./ViewersManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  gameManager.addPlayer(ws);
  ws.on("disconnect", () => gameManager.removePlayer(ws));
});
