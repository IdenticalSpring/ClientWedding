import axios from "axios";
// import request from "../config/request";
import { requestNoTK } from "../config/requestNoTK";

const baseURL = "http://localhost:8080/api/v1";

export const activateAccount = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/auth/activate?token=${token}`);
    console.log("Account activated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error activating account:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${baseURL}/auth/forgot-password`, {
      email,
    });
    return response.data; // Trả về dữ liệu từ API nếu thành công
  } catch (error) {
    throw error.response?.data || error.message; // Trả về lỗi nếu có
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/reset-password?token=${token}`,
      {
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi đặt lại mật khẩu");
  }
};

export const userAPI = {
  getAllBlog: async (page) => {
    const response = await requestNoTK.get(`blog?page=${page}`);
    return response.data;
  },

  getAllTemplates: async (page = 1, limit = 12) => {
    try {
      const response = await axios.get(`${baseURL}/templates`, {
        params: {
          page,
          limit,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "Error fetching templates:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getGuestList: async (limit = 20, page = 1, weddingId = "") => {
    try {
      const response = await requestNoTK.get(`/guest-list`, {
        params: {
          limit,
          page,
          weddingId, // Thêm tham số weddingId vào yêu cầu
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching guest list:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  addGuest: async (guestData) => {
    try {
      const response = await requestNoTK.post(`/guest-list`, guestData);
      console.log("Guest added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding guest:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getAllWedding: async (guestData) => {
    try {
      const response = await requestNoTK.get(`/wedding-details`, guestData);
      console.log("Get All wedding:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding guest:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
