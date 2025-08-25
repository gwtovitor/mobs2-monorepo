import { useEffect, useRef } from "react";

export function useWebSocket(url, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => console.log("WS conectado:", url);
    socket.onmessage = (event) => onMessage?.(event.data);
    socket.onclose = () => console.log("WS desconectado");

    return () => socket.close();
  }, [url, onMessage]);

  const sendMessage = (msg) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  return { sendMessage };
}
