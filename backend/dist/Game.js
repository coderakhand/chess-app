"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startDate = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "w",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "b",
            },
        }));
    }
    makeMove(player, move) {
        const turn = this.board.turn();
        if ((turn === "w" && player !== this.player1) ||
            (turn === "b" && player !== this.player2)) {
            player.send("not your move");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            player.send("invalid move");
            return;
        }
        const opponent = player === this.player1 ? this.player2 : this.player1;
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "b" : "w";
            opponent.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner,
                    move,
                },
            }));
            if (opponent !== this.player1) {
                this.player1.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: { winner },
                }));
            }
            if (opponent !== this.player2) {
                this.player2.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: { winner },
                }));
            }
            return;
        }
        opponent.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
    }
}
exports.Game = Game;
