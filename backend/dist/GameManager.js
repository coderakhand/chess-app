"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingPlayer = null;
        this.players = [];
    }
    addPlayer(socket) {
        this.players.push(socket);
        this.addHandler(socket);
    }
    removePlayer(socket) {
        this.players = this.players.filter((user) => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type == messages_1.INIT_GAME) {
                if (this.pendingPlayer !== null) {
                    const game = new Game_1.Game(this.pendingPlayer, socket);
                    this.games.push(game);
                    this.pendingPlayer = null;
                    console.log(this.games);
                    console.log("game started");
                }
                else {
                    this.pendingPlayer = socket;
                    console.log("player waiting");
                }
                return;
            }
            if (message.type == messages_1.MOVE) {
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload);
                }
                return;
            }
        });
    }
}
exports.GameManager = GameManager;
