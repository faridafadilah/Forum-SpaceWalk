import React, { useEffect } from "react";
import "./Video.css";
import Video1 from "../../../assets/img/thread-video.mp4";
import Video2 from "../../../assets/img/comment.mp4";
import Video11 from "../../../assets/img/thread-video2.mp4";
import Video22 from "../../../assets/img/comment2.mp4";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Aos from "aos";

function Video({theme}) {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
 
  return (
    <div className="container">
      <Grid
        container
        component="main"
        style={{ marginTop: "5%", marginBottom: "8%" }}
      >
        <Grid item xs={false} sm={4} md={6}>
          <Card
            sx={{
              minWidth: 275,
              background: "transparent",
              boxShadow: "none",
              borderRadius: "13px",
            }}
          >
            <video autoPlay loop muted id="video">
              <source src={theme === '' ? Video1 : Video22} type="video/mp4" />
            </video>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Card
            sx={{
              minWidth: 275,
              background: "transparent",
              boxShadow: "none",
              textAlign: "end",
            }}
          >
            <CardContent
              sx={{
                "@media (max-width: 1440px)": {
                  padding: "102px 0px 0px 89px",
                },
                "@media (max-width: 1024px)": {
                  padding: "102px 0px 0px 89px",
                },
                "@media (max-width: 768px)": {
                  padding: "50px 0px 0px 76px",
                },
                "@media (max-width: 320px)": {
                  textAlign: "center",
                  padding: "0px",
                },
              }}
              data-aos="fade-left"
            >
              <h3 className="txt-head">let's make a new thread</h3>
              <p className="txt-body">
                Let's start asking questions, providing information and starting
                discussions. Make a lot of people can establish a relationship
                with you
              </p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        component="main"
        sx={{
          marginTop: "5%",
          marginBottom: "5%",
          "@media (max-width: 320px)": {
            flexDirection: "column-reverse",
          },
        }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Card
            sx={{
              minWidth: 275,
              background: "transparent",
              boxShadow: "none",
              textAlign: "justify",
            }}
          >
            <CardContent
              sx={{
                "@media (max-width: 1440px)": {
                  padding: "102px 90px 0px 0px",
                },
                "@media (max-width: 1024px)": {
                  padding: "102px 90px 0px 0px",
                },
                "@media (max-width: 768px)": {
                  padding: "48px 76px 0px 0px",
                },
                "@media (max-width: 320px)": {
                  textAlign: "center",
                  padding: "0px",
                },
              }}
              data-aos="fade-right"
              className="content-head"
            >
              <h3 className="txt-head">let's discuss</h3>
              <p className="txt-body">
                Let's start the discussion by contributing directly to comments.
                Start opening your conversation to increase your insight
              </p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={false} sm={4} md={6}>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "13px",
              background: "transparent",
            }}
          >
            <video autoPlay loop muted id="video">
              <source src={theme === '' ? Video2 : Video11} type="video/mp4" />
            </video>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
export default Video;
