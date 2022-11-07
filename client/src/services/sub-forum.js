import http from "./http_common";
import authHeader from "./auth-header";

const getAllSubForum = (mainId, lastId, limit) => {
  return http.get(`sub?mainforumId=${mainId}&lastId=${lastId}&limit=${limit}`);
};

const getSubForumById = (id) => {
  return http.get(`sub/${id}`);
};

const createSubForum = (data) => {
  return http.post(`sub/create`, data, { headers: authHeader() });
};

const updateSubForum = (id, data) => {
  return http.patch(`sub/${id}`, data, { headers: authHeader() });
};

const deleteSubById = (id) => {
  return http.delete(`sub/${id}`, { headers: authHeader() });
};

const SubService = {
  getAllSubForum,
  getSubForumById,
  createSubForum,
  updateSubForum,
  deleteSubById
};

export default SubService;