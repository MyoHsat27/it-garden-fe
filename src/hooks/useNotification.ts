import { DefaultEventsMap } from "./../../node_modules/@socket.io/component-emitter/lib/esm/index.d";
import { axiosApi } from "@/lib/axios";
import { Notification } from "@/types/api/notification";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useNotifications(userId: number) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    if (!userId) return;

    const s = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("identify", { userId });
    });

    s.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(s);
    fetchNotifications();

    return () => {
      s.disconnect();
    };
  }, [userId]);

  async function fetchNotifications() {
    try {
      const res = await axiosApi.get("/notifications");
      setNotifications(res.data.data);
      setUnreadCount(res.data.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }

  async function markAsRead(id: number) {
    try {
      await axiosApi.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }

  return { notifications, unreadCount, markAsRead, socket };
}
