import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageDefault from "../../assets/img/profile-default.jpg";
import Aos from "aos";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Image1 from "../../assets/img/spacewalk/angkasa1.jpg";
import Image2 from "../../assets/img/spacewalk/angkasa2.jpg";
import Image3 from "../../assets/img/spacewalk/angkasa3.jpg";
import Image4 from "../../assets/img/spacewalk/angkasa4.jpg";
import Image5 from "../../assets/img/spacewalk/angkasa5.jpg";
import Image6 from "../../assets/img/spacewalk/angkasa6.jpg";
import Image7 from "../../assets/img/spacewalk/angkasa7.jpg";
import Image8 from "../../assets/img/spacewalk/angkasa8.jpg";
import "aos/dist/aos.css";
import "./Profile.css";
import ThreadService from "../../services/thread-forum";
import userService from "../../services/user.service";
import moment from "moment";

function Profile() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const [thread, setThreads] = useState([]);
  const [limit, setLimit] = useState(2);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState("");
  //Random Title
  var titles = [
    '"No Hug & Kisses, Only Bug & Fixes"',
    '"Sleep - Eat - Code - Repeat!"',
    '"Whatever you are, be a good one."',
    '"Where focus goes energy flows."',
    '"Dont be stupid, it might make you famous."',
    '"Life is short. Smile while you still have teeth"',
    '"Don’t be so humble, you are not that great"',
    '"When nothing is going right, go left"',
    '"If others can, why should I"',
  ];
  // Random Image
  var images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8];

  function RandomFoto() {
    document.getElementsByClassName("front__bkg-photo")[0].style.background =
      "url(" + images[Math.floor(Math.random() * images.length)] + ")";
  }

  useEffect(() => {
    Aos.init({ duration: 1000 });
    getUser();
    getThread();
    RandomFoto();
  }, []);

  const getUser = async () => {
    userService
      .getUserAllById(id)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getThread = async () => {
    ThreadService.threadByUser(id, lastId, limit)
      .then((response) => {
        const newThread = response.data.result;
        setThreads([...thread, ...newThread]);
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

  return (
    <div className="m56" style={{ overflow: "hidden" }}>
      <div className="pt-4">
        <h1 className="text-center fw-bold">Profile</h1>
        <div className="container py-2">
          <div className="row my-4 justify-content-evenly">
            <div className="col-md-4 text-center mb-5">
              <div className="outer-div">
                <div className="inner-div">
                  <div className="front">
                    <div className="front__bkg-photo"></div>
                    <div className="foto">
                      <img
                        src={users.image === null? ImageDefault : users.url}
                        alt="img user"
                      />
                    </div>
                    <div className="front__text">
                      <h3 className="front__text-header fw-bold">
                        {users.username}
                      </h3>
                      <span className="front__text-hover">{users.email}</span>
                      <p className="front__text-para mt-5 px-3 fw-bold">
                        {titles[Math.floor(Math.random() * titles.length)]}
                      </p>
                    </div>
                  </div>
                  <div className="back">
                    <div className="social-media-wrapper">
                      <div className="row">
                        <div className="col-md-12">
                          <p className="text-light">My contacts</p>
                        </div>
                        <div className="col-md-12">
                        <a
                            href={
                              users.whatsapp === "null" || users.whatsapp === null
                                ? "https://whatsapp.com"
                                : `http://wa.me/${users.whatsapp}`
                            }
                            className="social-icon"
                          >
                            <i className="ri-whatsapp-line"></i>
                          </a>
                          <a
                            href={
                              users.linkedin === "null" || users.linkedin === null
                                ? "https://linkedin.com"
                                : `https://www.linkedin.com/in/${users.linkedin}`
                            }
                            className="social-icon"
                          >
                            <i className="ri-linkedin-line"></i>
                          </a>
                          <a
                            href={
                              users.github === "null" || users.github === null
                                ? "https://github.com" : `https://github.com/${users.github}`
                            }
                            className="social-icon"
                          >
                            <i className="ri-github-line"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div
                className="row"
                data-aos="fade-right"
                style={{ color: "var(--small-text-color)" }}
              >
                <h2 className="ctr fw-bold mb-3">{users.username}</h2>
                <p>
                  {users.bio === "null" || users.bio === null ? (
                    <b>
                      Let's fill in your Bio. Tell me all about yourself. Make
                      yourself attractive and show it to others. It's all on the
                      Space Walk. Happy Discussion!!
                    </b>
                  ) : (
                    users.bio
                  )}
                </p>
                <div className="col-6">
                  <p>
                    <b>Gender: </b>
                    {users.gender === "null" || users.gender === null
                      ? "-"
                      : users.gender}
                  </p>
                  <p>
                    <b>Date of Birth: </b>
                    {users.birth === "null" || users.birth === null
                      ? "-"
                      : moment(users.birth).format("LL")}
                  </p>
                  <p>
                    <b>Address: </b>
                    {users.address === "null" || users.address === null
                      ? "-"
                      : users.address}
                  </p>
                </div>
                <div className="col-6">
                  <p>
                    <b>Email: </b>
                    {users.email}
                  </p>
                  <p>
                    <b>Hobbies: </b>
                    {users.hobies === "null" || users.hobies === null
                      ? "-"
                      : users.hobies}
                  </p>
                </div>
              </div>
              <InfiniteScroll
                dataLength={thread.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
              >
                <div style={{ marginTop: "30px" }}>
                {thread && (<h2 className="ctr fw-bold mb-3">Thread yang dibuat!</h2>)}
                  {thread.length > 0 ? (
                    thread.map((thread, index) => (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ marginBottom: "10px" }}
                        key={index}
                      >
                        <CardActionArea
                          component="a"
                          onClick={() => navigate(`/thread/${thread.id}`)}
                        >
                          <Card
                            sx={{
                              display: "flex",
                              borderRadius: "0px",
                              background: "var(--team-card-bg)",
                            }}
                          >
                            <CardContent
                              sx={{
                                flex: 1,
                                background: "var(--team-card-bg)",
                                padding: "31px",
                              }}
                            >
                              <Typography
                                component="h2"
                                variant="h5"
                                className="sub-judul"
                                sx={{ fontSize: "1.5rem" }}
                              >
                                {thread.title}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                sx={{
                                  color: "var(--link-color)",
                                  fontFamily: "cursive",
                                }}
                              >
                                {moment(thread.createdAt).format("LL")}
                              </Typography>
                            </CardContent>
                            {thread.image === null ? null : (
                              <CardMedia
                                component="img"
                                sx={{
                                  width: "25%",
                                  display: { xs: "none", sm: "block" },
                                }}
                                image={thread.url}
                                alt="Image Sub"
                              />
                            )}
                          </Card>
                        </CardActionArea>
                      </Grid>
                    ))
                  ) : (
                    <p style={{color: 'var(--heading-color)'}}>ups... no threads have been created yet :(</p>
                  )}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
