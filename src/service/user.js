import axios from "axios";
// import request from "../config/request";
import { requestNoTK } from "../config/requestNoTK";
import { request } from "../config/request";

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
  getGuestList: async (limit = 10, page = 1, weddingId = "") => {
    try {
      const response = await request.get(`/guest-list`, {
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
      const response = await request.post(`/guest-list`, guestData);
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
      const response = await request.get(`/wedding-details`, guestData);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding guest:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  addEvents: async (eventData) => {
    try {
      const response = await request.post(`/event-details`, eventData);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding events:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getAllEvents: async (eventData) => {
    try {
      const response = await request.get(`/event-details`, eventData);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding Event:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getEventsByWeddingId: async (weddingId) => {
    try {
      const response = await request.get(`/event-details/wedding/${weddingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events by weddingId:", error);
      throw error;
    }
  },
  getInfoUser: async () => {
    try {
      const response = await request.get(`/auth/profile`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user information:", error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await request.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  uploadImages: async (image) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await request.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating image:", error);
      throw error.response?.data || { message: "Failed to create image" };
    }
  },
  getAllTemplates: async (page, limit) => {
    try {
      const response = await request.get(`/templates`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching templates:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getTemplateById: async (id) => {
    const response = await request.get(`/templates/${id}`);
    return response.data;
  },
  getTemplateUserById: async (id) => {
    const response = await request.get(`/templates_user/${id}`);
    return response.data;
  },
  createTemplateUser: async (templateData, UserId, brideName, groomName) => {
    try {
      const formData = new FormData();
      formData.append("name", templateData.name);
      formData.append("description", templateData.description);
      formData.append("accessType", templateData.accessType);
      formData.append("metaData", templateData.metaData);
      formData.append("thumbnailUrl", templateData.thumbnailUrl);
      formData.append("userId", UserId);
      formData.append("groomName", groomName);
      formData.append("brideName", brideName);
      const response = await request.post("/templates_user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error.response?.data || { message: "Failed to create template" };
    }
  },
  createSectionUser: async (sectionData) => {
    try {
      const response = await request.post("/section_user", sectionData);
      return response.data;
    } catch (error) {
      console.error("Error creating section:", error);
      throw error.response?.data || { message: "Failed to create section" };
    }
  },
  uploadImages: async (image) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await request.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating image:", error);
      throw error.response?.data || { message: "Failed to create image" };
    }
  },
  getAllTemplateById: async (id, page, limit) => {
    const response = await request.get(
      `/templates_user?userId=${id}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
