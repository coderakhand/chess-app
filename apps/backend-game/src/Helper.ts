import type WebSocket from "ws";

type jsonMessageType = { ErrorMessage: string } | { message: string };

export const sendJsonMessage = (
  socket: WebSocket,
  jsonMessage: jsonMessageType
) => {
  socket.send(JSON.stringify(jsonMessage));
};
