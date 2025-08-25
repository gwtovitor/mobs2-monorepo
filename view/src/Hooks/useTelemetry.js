import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';

export function useTelemetry(token) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // state: last & history por placa
  const [lastByPlate, setLastByPlate] = useState(() => ({}));
  const [historyByPlate, setHistoryByPlate] = useState(() => ({}));

  const connect = useCallback(() => {
    if (!token || wsRef.current) return;
    const url = new URL(WS_URL);
    url.searchParams.set('token', token);
    const ws = new WebSocket(url.toString());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // por padrão: assinar todas
      ws.send(JSON.stringify({ type: 'subscribe' }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'telemetry') {
          const p = msg.data; // { plate, lat, lng, speed, fuel, timestamp }
          setLastByPlate((prev) => ({ ...prev, [p.plate]: p }));
          setHistoryByPlate((prev) => {
            const arr = prev[p.plate] ? [...prev[p.plate]] : [];
            arr.push(p);
            if (arr.length > 200) arr.shift();
            return { ...prev, [p.plate]: arr };
          });
        }
        if (msg.type === 'telemetry-batch') {
          const plate = msg.plate;
          const history = msg.history || [];
          setHistoryByPlate((prev) => ({ ...prev, [plate]: history }));
        }
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };
  }, [token]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const subscribeAll = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'subscribe' }));
  }, []);

  const subscribePlate = useCallback((plate) => {
    wsRef.current?.send(JSON.stringify({ type: 'subscribe', plate }));
  }, []);

  const requestHistory = useCallback((plate, limit = 100) => {
    wsRef.current?.send(JSON.stringify({ type: 'history', plate, limit }));
  }, []);

  useEffect(() => {
    if (!token) return;
    connect();
    return disconnect;
  }, [token, connect, disconnect]);

  return {
    connected,
    lastByPlate,
    historyByPlate,
    subscribeAll,
    subscribePlate,
    requestHistory,
  };
}
