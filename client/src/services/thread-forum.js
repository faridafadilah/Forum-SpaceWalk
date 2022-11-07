import http from "./http_common";
import authHeader from "./auth-header";

const getAllThread = (subId, lastId, limit) => {
  return http.get(`thread?subforumId=${subId}&lastId=${lastId}&limit=${limit}`);
};

const getThreadById = (id) => {
  return http.get(`thread/${id}`);
};

const createThread = (data) => {
  return http.post(`thread/create`, data, { headers: authHeader() });
};

const deleteThreadById = (id) => {
  return http.delete(`thread/${id}`, { headers: authHeader() });
};

const threadByUser = (userId, lastId, limit) => {
    return http.get(`thread/user/${userId}?lastId=${lastId}&limit=${limit}`);
}

const ThreadService = {
  getAllThread,
  getThreadById,
  createThread,
  deleteThreadById,
  threadByUser
};

export default ThreadService;