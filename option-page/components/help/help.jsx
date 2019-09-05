import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Img from "./help.png";
import Img2 from "./help2.png";

const useStyles = makeStyles({
  card: {
    maxWidth: 800
  },
  media: {
    height: 140
  },
  media2: {
    height: 680
  }
});

const init = () => {
  if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia({ video: true }, onSuccess, onFail);
  } else {
    alert("Camera is not available");
  }
}

const onSuccess= (stream) => {

}

const onFail= () => {
  alert("could not connect to stream. Please allow camera permission!");
}

const openGitIssues = () => {
  window.location.replace("https://github.com/fxnoob/swipe-tabs-chrome-extension/issues")
}
const openWiki = () => {
  window.location.replace("https://github.com/fxnoob/swipe-tabs-chrome-extension/wiki")
}

export default function MediaCard() {
  const classes = useStyles();

  React.useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <h1>Help</h1>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={Img}
            title="Troubleshooting"
          />
          <CardContent>
            Allow Camera permission after that close this tab and click on
            extension's icon again.
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={openGitIssues}>
            Other Issue?
          </Button>
        </CardActions>
      </Card>
      <h1>Features</h1>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia className={classes.media2} image={Img2} title="Features" />
          <CardContent>
            <p>Wave hand left to right to switch active tab towards right.</p>
            <p>Wave hand right to left to switch active tab towards left.</p>
            <p>Wave hand bottom to top to close active tab.</p>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={openWiki}>
            How to create a Custom Handler?
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
