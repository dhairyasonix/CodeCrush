// production - "/api"  dev- "http://localhost:7777"
export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:7777" : "/api";
