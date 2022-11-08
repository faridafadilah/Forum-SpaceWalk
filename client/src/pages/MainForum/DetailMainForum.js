import React, { useState, useEffect } from "react";
import { Button, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActions } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Container } from "@mui/system";
import { useSelector } from "react-redux";
import SubService from "../../services/sub-forum";
import MainService from "../../services/main-forum";
import moment from "moment";
import "../../assets/css/MainForum.css";

function DetailMainForum() {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();
  const [main, setMain] = useState(null);
  const [subs, setSubs] = useState([]);
  const [limit, setLimit] = useState(3);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    } else {
      setShowAdminBoard(false);
      setShowModeratorBoard(false);
    }
    getMain();
    getSub([]);
  }, [id, currentUser, lastId]);

  const getMain = async () => {
    MainService.getMainForumById(id)
      .then((response) => {
        setMain(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getSub = async () => {
    SubService.getAllSubForum(id, lastId, limit)
      .then((response) => {
        const newSubs = response.data.result;
        setSubs([...subs, ...newSubs]);
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

  const deleteSubForum = async (mainId) => {
    SubService.deleteSubById(mainId)
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      <div className="detail">
        <Link to="/main" style={{ fontSize: "28px" }}>
          <i className="ri-arrow-left-circle-line"></i>
        </Link>
        <Card
          className="card-body"
          sx={{
            background: "var(--btn-secondary-bg)",
            transform: "translateY(0)",
            boxShadow:
              "0 0 0px #9ed3ff, -38px 0 145px #020672, 10px 0 60px #6b12af",
          }}
        >
          <CardContent className="content-detail">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {main && (
                <div>
                  <h1 style={{ fontSize: "45px", fontFamily: "revert" }}>
                    {main.title}
                  </h1>
                  <p
                    style={{
                      color: "var(--bs-gray-600)",
                      fontFamily: "cursive",
                    }}
                  >
                    {main.description}
                  </p>
                </div>
              )}

              {showAdminBoard || showModeratorBoard ? (
                <div>
                  <Button
                    type="submit"
                    sx={{ mt: 3, fontSize: "42px", lineHeight: "6px" }}
                    onClick={() => navigate(`/sub/create/${id}`)}
                  >
                    <i className="ri-add-line"></i>
                  </Button>
                </div>
              ) : null}
            </div>

            <Divider sx={{ margin: "2rem 0" }} />
            <InfiniteScroll
              dataLength={subs.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              <div>
                {subs.length < 1 ? (
                  <h1>Data Masih Kosong</h1>
                ) : (
                  subs.map((sub, index) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{ marginBottom: "10px" }}
                      key={index}
                    >
                      <CardActionArea component="a">
                        <Card
                          sx={{
                            display: "flex",
                            height: "200px",
                            borderRadius: "0px",
                          }}
                          className="card-forum"
                        >
                          <CardContent
                            sx={{
                              flex: 1,
                              background: "var(--newsletter-bg)",
                              padding: "31px",
                            }}
                          >
                            <Typography
                              component="h2"
                              variant="h5"
                              className="sub-judul"
                              sx={{ fontSize: "1.5rem" }}
                              onClick={() => navigate(`/sub/${sub.id}`)}
                            >
                              {sub.judul}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              sx={{
                                color: "var(--bs-gray-300)",
                                fontFamily: "cursive",
                              }}
                              onClick={() => navigate(`/sub/${sub.id}`)}
                            >
                              {moment(sub.createdAt).format("LL")}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              paragraph
                              className="paragraph"
                              onClick={() => navigate(`/sub/${sub.id}`)}
                            >
                              {sub.description}
                            </Typography>
                            {showModeratorBoard || showAdminBoard ? (
                              <CardActions sx={{ padding: "0px" }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  sx={{ background: "#5500fb" }}
                                  onClick={() =>
                                    navigate(`/sub/edit/${sub.id}`)
                                  }
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button
                                  size="small"
                                  color="primary"
                                  sx={{ background: "#5500fb" }}
                                  variant="contained"
                                  onClick={() => deleteSubForum(sub.id)}
                                >
                                  <i className="ri-delete-bin-7-line"></i>
                                </Button>
                              </CardActions>
                            ) : (
                              ""
                            )}
                          </CardContent>
                          <CardMedia
                            component="img"
                            sx={{
                              width: "25%",
                              display: { xs: "none", sm: "block" },
                            }}
                            image={sub.url}
                            alt="Image Sub"
                          />
                        </Card>
                      </CardActionArea>
                    </Grid>
                  ))
                )}
              </div>
            </InfiniteScroll>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default DetailMainForum;
