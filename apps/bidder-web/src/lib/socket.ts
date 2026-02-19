import { io, Socket } from "socket.io-client";

const wsUrl =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:4000");

export function createBiddingSocket(accessToken?: string): Socket {
  return io(`${wsUrl}/bidding`, {
    path: "/socket.io",
    auth: accessToken ? { token: accessToken } : undefined,
    transports: ["websocket"], // prefer websocket only (better performance)
    withCredentials: true, // useful if cookies/session used
  });
}
