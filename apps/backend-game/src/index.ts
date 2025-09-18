import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  GameManager.getInstance().addUser(ws);
  ws.on("disconnect", () => GameManager.getInstance().removeUser(ws));
});
