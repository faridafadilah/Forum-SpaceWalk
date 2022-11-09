import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import parser from "html-react-parser";
import { Container } from "@mui/system";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import ImageDefault from "../../assets/img/profile-default.jpg";
import SubService from "../../services/sub-forum";
import ThreadService from "../../services/thread-forum";
import Image1 from "../../assets/img/spacewalk/angkasa9.jpg";
import "../../assets/css/SubForum.css";

const ShowSubForum = ({ theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [sub, setSub] = useState(null);
  const [thread, setThread] = useState([]);
  const [limit, setLimit] = useState(4);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const getSub = async () => {
    SubService.getSubForumById(id)
      .then((response) => {
        setSub(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getThread = async () => {
    ThreadService.getAllThread(id, lastId, limit)
      .then((response) => {
        const newThreads = response.data.result;
        setThread([...thread, ...newThreads]);
        setTempId(response.data.lastId);
        setHasMore(response.data.hasMore);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  const deleteThread = async (subId) => {
    ThreadService.deleteThreadById(subId)
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (currentUser) {
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    } else {
      setShowAdminBoard(false);
      setShowModeratorBoard(false);
    }
    getSub();
    getThread();
  }, [id, currentUser, lastId]);

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
      <div className="thread">
        <Card className="thread-card" sx={{ background: "url(" + Image1 + ") no-repeat", backgroundSize: 'cover' }}>
          <CardContent className="card-content">
            <div
              style={{
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              {sub && (
                <div className="title-sub">
                  <h1 className="Judul">{sub.judul}</h1>
                  <p
                    className="thread-content"
                    style={{
                      color: "var(--link-color)",
                      fontFamily: "cursive",
                    }}
                  >
                    {sub.description}
                  </p>
                </div>
              )}
              {currentUser ? (
                <Button
                  type="submit"
                  sx={{ mt: 3, mb: 2, fontSize: "42px", lineHeight: "6px" }}
                  onClick={() => navigate(`/thread/create/${id}`)}
                >
                  <i className="ri-add-line" style={{color: 'var(--heading-color)'}}></i>
                </Button>
              ) : null}
            </div>
            <InfiniteScroll
              style={{overflow: 'inherit'}}
              dataLength={thread.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<h4 style={{ color: "white" }}>Loading...</h4>}
            >
              <div className="thread-main">
                {thread.length < 1 ? (
                  <h1>let's create a new thread</h1>
                ) : (
                  thread.map((thread, index) => (
                    <div key={index} className="item-thread">
                      <Card
                        className="thread-post"
                        key={index}
                        sx={{
                          height: "85%",
                          marginBottom: "20px",
                          background: "transparent",
                          boxShadow: "0px 0px 0px 0px rgb(0 0 0 /0% )",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="profile"
                        >
                          <CardHeader
                            sx={{ cursor: "pointer" }}
                            avatar={
                              <Avatar
                                aria-label="recipe"
                                onClick={() => profile(thread.userId)}
                              >
                                <img
                                  src={
                                    thread.userImage === "null"
                                      ? ImageDefault
                                      : thread.userImage
                                  }
                                  alt="post img"
                                  style={{ width: "39px" }}
                                />
                              </Avatar>
                            }
                            title={
                              <div className="title-nameUser">
                                {thread.userName}
                              </div>
                            }
                            subheader={
                              <div style={{ color: "#c9c9e1" }}>
                                {moment(thread.createdAt).format("LL")}
                              </div>
                            }
                          />
                          {showModeratorBoard || showAdminBoard ? (
                            <IconButton
                            className= "delete"
                              onClick={() => deleteThread(thread.id)}
                              sx={{ color: "white", marginRight: '20px' }}
                            >
                              <i className="ri-delete-bin-6-line"></i>
                            </IconButton>
                          ) : null}
                        </div>
                        <CardContent
                          onClick={() => navigate(`/thread/${thread.id}`)}
                          className="content-card"
                        >
                          <h1 className="title-thread">{thread.title}</h1>
                          <h5
                            className="content-thread"
                            style={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: "5",
                              color: 'rgb(205 202 202)',
                              fontFamily: "ui-sans-serif",
                              cursor: "pointer",
                              marginTop: "-15px",
                            }}
                          >
                            {parser(thread.content)}
                          </h5>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </InfiniteScroll>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ShowSubForum;
