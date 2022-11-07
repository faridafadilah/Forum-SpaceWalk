import http from "./http_common";
import authHeader from "./auth-header";

const getAllComment = (subId, page) => {
  return http.get(`comment?threadId=${subId}`, {params: {page}});
};

const createComment = (data) => {
  return http.post(`comment/create`, data);
};

const deleteCommentById = (id) => {
  return http.delete(`comment/${id}`, { headers: authHeader() });
};

const CommentService = {
  getAllComment,
  createComment,
  deleteCommentById
};

export default CommentService;