import axios from "axios";
import QueryString from "qs";

export const requestNoTK = axios.create({
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  baseURL: `http://localhost:8080/api/v1`,
  timeout: 50000,
});

requestNoTK.defaults.paramsSerializer = {
  serialize: (params) => {
    return QueryString.stringify(params, { arrayFormat: "repeat" });
  },
};

requestNoTK.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);