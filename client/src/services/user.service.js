import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "test/all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "test/user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "test/mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "test/admin", { headers: authHeader() });
};

const getUserAllById = (id) => {
  return axios.get(API_URL + `userRole/user/${id}`)
}

const getUserRole = (params) => {
  return axios.get(API_URL + 'userRole', {params})
}

const getUserId = (userId) => {
  return axios.get(API_URL + `userRole/${userId}`)
}

const updateRoleId = (userId, data) => {
  return axios.put(API_URL + `userRole/${userId}`, data, { headers: authHeader() })
}

const getLogger = (keyword, page, limit) => {
  return axios.get(API_URL + `log?search_query=${keyword}&page=${page}&limit=${limit}`)
}

const getProfile = (id) => {
  return axios.get(API_URL + `profile/${id}`)
}

const editProfile = (id, data) => {
  return axios.patch(API_URL + `profile/${id}`, data)
}

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getUserRole,
  getUserId,
  updateRoleId,
  getUserAllById,
  getLogger,
  editProfile,
  getProfile
};

export default userService