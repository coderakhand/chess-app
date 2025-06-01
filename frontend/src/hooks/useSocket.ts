import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}`);

    ws.onopen = () => {
      setSocket(ws);
      console.log("open");
    };

    ws.onclose = () => {
      setSocket(null);
      console.log("closed");
    };

    return () => {
      ws.close();
      console.log("unmounted");
    };
  }, []);

  return socket;
};
