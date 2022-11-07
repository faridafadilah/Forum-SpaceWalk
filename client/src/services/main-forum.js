import http from "./http_common";
import authHeader from "./auth-header";

const getAllMainForum = (keyword, lastId, limit) => {
  return http.get(`main?search_query=${keyword}&lastId=${lastId}&limit=${limit}`);
};

const getMainForumById = (id) => {
  return http.get(`main/${id}`);
};

const createMainForum = (data) => {
  return http.post(`main/create`, data, { headers: authHeader() });
};

const updateMainForum = (id, data) => {
  return http.patch(`main/${id}`, data, { headers: authHeader() });
};

const deleteMainById = (id) => {
  return http.delete(`main/${id}`, { headers: authHeader() });
};

const MainService = {
  getAllMainForum,
  getMainForumById,
  createMainForum,
  updateMainForum,
  deleteMainById
};

export default MainService;