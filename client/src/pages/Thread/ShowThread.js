import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, List } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import parser from "html-react-parser";
import { Container } from "@mui/system";
import { useSelector } from "react-redux";
import userService from "../../services/user.service";
import ImageDefault from "../../assets/img/profile-default.jpg";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CommentService from "../../services/comment";
import ThreadService from "../../services/thread-forum";
import { Tiptap } from "../../components/UI Public/TipTap/TipTap";
import moment from "moment";
import "../../assets/css/Thread.css";

const variants = ["h1", "h3", "body1", "caption"];

function TypographyDemo(props) {
  const { loading = false } = props;

  return (
    <div>
      {variants.map((variant) => (
        <Typography component="div" key={variant} variant={variant}>
          {loading ? <Skeleton /> : variant}
        </Typography>
      ))}
    </div>
  );
}

TypographyDemo.propTypes = {
  loading: PropTypes.bool,
};

function DetailThread() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [clear, setClear] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getUser(currentUser.id);
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    } else {
      setShowAdminBoard(false);
      setShowModeratorBoard(false);
    }
    getThread();
    getPosts();
  }, []);

  const getUser = (userId) => {
    userService
      .getUserAllById(userId)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getThread = async () => {
    ThreadService.getThreadById(id)
      .then((response) => {
        setThread(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPosts = async () => {
    CommentService.getAllComment(id, page)
      .then((response) => {
        if (response.data.length) {
          setPosts(response.data);
          setPage(page + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleReply = async (event) => {
    event.preventDefault();
    setClear(true);
    if (!replyContent) return;
    const data = {
      userId: currentUser.id,
      nameUser: currentUser.username,
      threadId: thread.id,
      content: replyContent,
      imageUser: users.url,
    };

    CommentService.createComment(data)
      .then((response) => {
        setPosts([...posts, response.data]);
        setReplyContent("");
        setClear(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePost = async (postId) => {
    CommentService.deleteCommentById(postId)
      .then((response) => {
        getPosts();
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const profile = (userId) => {
    if (currentUser) {
      if (currentUser.id === userId) {
        navigate("/profile");
      } else {
        navigate(`/profile/${userId}`);
      }
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <Container>
      <div className="grid-container">
        <div className="grid-item">
          <div>
            <Card sx={{ width: "100%", background: "var(--card-bg)" }} className="card-detail">
              <CardContent>
                {thread && (
                  <>
                    <h1 style={{ fontSize: "3rem" }}>{thread.title}</h1>
                    <p className="head-card">
                      <i className="ri-user-line"></i>
                      {thread.userName}
                      {"  "} <i className="ri-time-line"></i>
                      {moment(thread.createdAt).format("LL")}
                    </p>
                    {thread.image === null ? null : (
                      <img
                        src={thread.url}
                        alt="Preview Img"
                        style={{ width: "97%", height: '300px' }}
                      />
                    )}
                    <p
                      className="head-card"
                      style={{
                        marginTop: "20px",
                        fontSize: "small",
                        fontFamily: "system-ui",
                      }}
                    >
                      {parser(thread.content)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="ui minimal comments">
              <List>
                {posts.map((post, index) => (
                  <Card
                    sx={{
                      width: "100%",
                      marginBottom: "10px",
                      background: "var(--card-bg)",
                    }}
                    className="card-paper"
                    key={index}
                  >
                    <CardContent style={{ padding: "14px 31px 0px 21px" }}>
                      <div className="comment">
                        <a className="avatar">
                          <img
                            src={post.imageUser? post.imageUser : ImageDefault}
                            alt="img User"
                          />
                        </a>
                        <div className="content">
                          <a
                            className="author"
                            style={{
                              color: "var(--link-active)",
                              cursor: "pointer",
                            }}
                            onClick={() => profile(post.userId)}
                          >
                            {post.nameUser}
                          </a>
                          <div className="metadata">
                            <span
                              className="date"
                              style={{ color: "var(--link-color)" }}
                            >
                              {moment(post.createdAt).format("LL")}
                            </span>
                          </div>
                          <div
                            className="text"
                            style={{ color: "var(--link-color)" }}
                          >
                            {parser(post.content)}
                          </div>
                          <div className="actions">
                            {showAdminBoard || showModeratorBoard ? (
                              <a
                                className="reply"
                                onClick={() => deletePost(post.id)}
                                style={{ color: "var(--bs-border-color)" }}
                              >
                                Delete
                              </a>
                            ) : currentUser ? (
                              currentUser.id === post.userId ? (
                                <a
                                  className="reply"
                                  onClick={() => deletePost(post.id)}
                                  style={{ color: "var(--bs-border-color)" }}
                                >
                                  Delete
                                </a>
                              ) : null
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </div>

            {currentUser ? (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div style={{ marginRight: "5px" }}>
                  <button
                    className="load-more"
                    disabled={!hasMore}
                    onClick={getPosts}
                  >
                    Load More Comment
                  </button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    sx={{ mb: 2, background: "#816aff" }}
                    onClick={() => setIsReplying(true)}
                  >
                    <i className="ri-reply-line"></i> Reply
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}

            {isReplying && (
              <div style={{ width: "100%" }}>
                <Tiptap setValue={setReplyContent} clear={clear} />
                <Box component="form" onSubmit={handleReply} noValidate>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 2, background: "#816aff" }}
                  >
                    Kirim Komentar
                  </Button>
                </Box>
              </div>
            )}
          </div>
        </div>
        {/* </Grid> */}
        {/* <Grid item xs={4} className="iklan"> */}
        <div className="iklan">
          <div>
            <Box>
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
              <Skeleton
                sx={{ bgcolor: "#727272", mb: 1 }}
                variant="rectangular"
                height={118}
              />
            </Box>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default DetailThread;
