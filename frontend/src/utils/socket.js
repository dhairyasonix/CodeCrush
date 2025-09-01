import io from "socket.io-client";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

export const cerateSocketConnection = () => {
  const token = Cookies.get("token");
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token },
    });
  } else {
    return io("/", {
      path: "/api/socket.io",
      withCredentials: true,
      transports: ["websocket"],
      auth: { token },
    });
  }
};
