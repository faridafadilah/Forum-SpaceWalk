import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Button, Divider, CardActions } from "@mui/material";
import React, { useState, useEffect } from "react";
import Gif from "../../assets/img/spaceawlk2.gif";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/system";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import MainService from "../../services/main-forum";
import "../../assets/css/MainForum.css";

function ShowMainForum() {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [limit, setLimit] = useState(6);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [keyword, setKeywoard] = useState("");
  const [query, setQuery] = useState("");
  const [mains, setMains] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    } else {
      setShowAdminBoard(false);
      setShowModeratorBoard(false);
    }
    getMains();
  }, [currentUser, lastId, keyword]);

  const getMains = async () => {
    MainService.getAllMainForum(keyword, lastId, limit)
      .then((response) => {
        const newMains = response.data.result;
        setMains([...mains, ...newMains]);
        setTempId(response.data.lastId);
        setHasMore(response.data.hasMore);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  const searchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setMains([]);
    setKeywoard(query);
  };

  const deleteMainForum = async (mainId) => {
    MainService.deleteMainById(mainId)
      .then((response) => {
        getMains();
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      <div style={{ padding: "2rem" }}>
        <div className="head-category">
          <h1 className="category text-center">Category Forum</h1>
          <div className="input">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "345%" }}
            />
            <button
              style={{ marginLeft: "7px" }}
              className="btn btn-outline-secondary"
              type="button"
              onClick={searchData}
            >
              Search
            </button>
          </div>
          {showModeratorBoard || showAdminBoard ? (
            <div>
              <Button
                type="submit"
                className="button-add"
                sx={{ mt: "11px", fontSize: "42px", lineHeight: "6px" }}
                onClick={() => navigate("/main/create")}
              >
                <i className="ri-add-line"></i>
              </Button>
            </div>
          ) : null}
        </div>
        <Divider style={{ margin: "2rem 0" }} />
        {loading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <center>
              <img src={Gif} alt="" style={{ width: "100%" }} />
            </center>
          </div>
        )}
        <InfiniteScroll
          dataLength={mains.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          style={{ overflow: "unset" }}
        >
          <div className="category__wrapper">
            {mains.map((main, index) => (
              <div className="item-category" key={index}>
                <Card
                  className="card-category"
                  sx={{
                    maxWidth: 345,
                    marginBottom: "20px",
                    background: "var(--team-card-bg)",
                  }}
                >
                  <CardMedia
                    className="image-category"
                    key={index}
                    component="img"
                    alt="img-main"
                    height="200"
                    image={main.url}
                    onClick={() => navigate(`/main/${main.id}`)}
                  />
                  <div className="content">
                    <CardContent
                      sx={{ textAlign: "center" }}
                      className="content-card"
                      onClick={() => navigate(`/main/${main.id}`)}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        className="title-category"
                      >
                        {main.title}
                      </Typography>
                      <p className="description">{main.description}</p>
                    </CardContent>
                    {showModeratorBoard || showAdminBoard ? (
                      <CardActions
                        sx={{ justifyContent: "center" }}
                        className="card-action"
                      >
                        <IconButton
                          onClick={() => navigate(`/main/edit/${main.id}`)}
                        >
                          <i className="ri-edit-box-fill"></i>
                        </IconButton>
                        <IconButton onClick={() => deleteMainForum(main.id)}>
                          <i className="ri-delete-bin-6-fill"></i>
                        </IconButton>
                      </CardActions>
                    ) : null}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </Container>
  );
}

export default ShowMainForum;
