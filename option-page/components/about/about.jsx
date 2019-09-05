import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500
  }
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Hi, This is{" "}
          <a href="https://github.com/fxnoob" target="_blank">
            Hitesh Saini
          </a>
          . If you like this project give it a Star{" "}
          <a href="https://github.com/fxnoob/swipe-tabs-chrome-extension">
            here.
          </a> Visit my Youtube channel <a href="https://youtube.com/fxnoob">Here</a>
        </Typography>
    </div>
  );
};
