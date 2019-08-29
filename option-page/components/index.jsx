import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Gest from "../../src/lib/gest.es6";
import Img from './help.png'
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
    card: {
        maxWidth: 800,
    },
    media: {
        height: 140,
    },
});

const gest = new Gest();
gest.options.subscribeWithCallback((gesture) => {
    console.log(gesture);

})
gest.start()

export default function MediaCard() {
    const classes = useStyles();

    return (
        <Container maxWidth="sm" spacing={3}>
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={Img}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        Allow Camera permission as shown in the picture.
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
    );
}
