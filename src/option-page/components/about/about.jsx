import React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500
  }
});

const About = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>About</h1>
      <Typography variant="h5" gutterBottom>
        Hi, This is{" "}
        <a rel="noreferrer" href="https://github.com/fxnoob" target="_blank">
          Hitesh Saini
        </a>
        . If you like this project give it a Star{" "}
        <a rel="noreferrer" href="https://github.com/fxnoob/swipe-tabs-chrome-extension">
          here.
        </a>{" "}
        Visit my Youtube channel <a rel="noreferrer" href="https://youtube.com/fxnoob">Here.</a>
      </Typography>
    </div>
  );
};

export default About;
