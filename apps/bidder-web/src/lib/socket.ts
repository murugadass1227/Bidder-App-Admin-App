import { io } from "socket.io-client";

const wsUrl =
  process.env.NEXT_PUBLIC_WS_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost:4000");

export function createBiddingSocket(accessToken?: string) {
  return io(`${wsUrl}/bidding`, {
    path: "/socket.io",
    auth: accessToken ? { token: accessToken } : {},
    transports: ["websocket", "polling"],
  });
}
