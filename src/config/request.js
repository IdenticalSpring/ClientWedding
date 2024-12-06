import axios from "axios";
import Cookies from "js-cookie";
import QueryString from "qs";
// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const request = axios.create({
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  baseURL: `http://localhost:8080/api/v1`,
  timeout: 50000,
});

request.defaults.paramsSerializer = {
  serialize: (params) => {
    return QueryString.stringify(params, { arrayFormat: "repeat" });
  },
};

request.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Token không tồn tại");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getToken = () => {
  return Cookies.get("token");
};
