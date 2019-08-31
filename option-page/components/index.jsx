import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Gest from "../../src/lib/gest.es6";
import Img from "./help.png";
import Img2 from "./help2.png";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  card: {
    maxWidth: 800
  },
  media: {
    height: 140
  },
  media2: {
    height: 470
  }
});

const gest = new Gest();
gest.options.subscribeWithCallback(gesture => {
  console.log(gesture);
});
gest.start();

export default function MediaCard() {
  const classes = useStyles();

  return (
    <div>
      <Container maxWidth="sm" spacing={3}>
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
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Container>
      <Container maxWidth="sm" spacing={3}>
        <h1>Features</h1>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media2}
              image={Img2}
              title="Features"
            />
            <CardContent>
              <p>Wave hand left to right to switch active tab towards right.</p>
              <p>Wave hand right to left to switch active tab towards left.</p>
              <p>Wave hand bottom to top to close active tab.</p>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
}
