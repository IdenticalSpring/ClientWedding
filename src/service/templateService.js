import axios from "axios";
const baseURL= `${process.env.REACT_APP_API_BASE_URL}`
// Tạo instance axios
export const AdminAPI = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
// Hàm để lấy access token từ cookie hoặc sessionStorage
const getAccessToken = () => {
  // Bạn có thể lấy token từ cookie hoặc sessionStorage
  return sessionStorage.getItem("access_token");
};

// Interceptor để tự động thêm token vào các yêu cầu
AdminAPI.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllTemplates = async (page = 1, limit = 12) => {
  try {
    const response = await AdminAPI.get(
      `/templatesUser?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error.response?.data || { message: "Failed to fetch templates" };
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await AdminAPI.get(`/templatesUser/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    throw error.response?.data || { message: "Failed to fetch template" };
  }
};

export const createTemplate = async (templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("name", templateData.name);
    formData.append("description", templateData.description);
    formData.append("accessType", templateData.accessType);
    formData.append("metaData", templateData.metaData);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await AdminAPI.post("/templatesUser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error.response?.data || { message: "Failed to create template" };
  }
};

export const updateTemplate = async (id, templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("name", templateData.name);
    formData.append("description", templateData.description);
    formData.append("accessType", templateData.accessType);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await AdminAPI.patch(`/templatesUser/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error.response?.data || { message: "Failed to update template" };
  }
};

export const deleteTemplateById = async (id) => {
  try {
    const response = await AdminAPI.delete(`/templatesUser/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error.response?.data || { message: "Failed to delete template" };
  }
};

export const createSection = async (sectionData) => {
  try {
    const response = await AdminAPI.post("/sectionsUser", sectionData);
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error.response?.data || { message: "Failed to create section" };
  }
};
export const getTemplateByUrl = async (url) => {
  try {
    console.log("aa")
    const response = await axios.get(`${baseURL}/templatesUser/by-url/${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template by url:", error);
    throw error;
  }
};

export default {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplateById,
  createSection,
  getTemplateByUrl
};
