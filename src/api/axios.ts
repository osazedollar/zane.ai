import axios from "axios";

const api = axios.create({
  baseURL: "https://cruiseapi.pendeet.com/api/v2",
  withCredentials: true,
});

export default api;
