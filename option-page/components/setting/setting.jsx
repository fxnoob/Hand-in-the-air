import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import FolderIcon from "@material-ui/icons/Folder";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Db from "../../../src/lib/db";

const db = new Db();
const useStyles = makeStyles(theme => ({
  media: {
    height: 140
  },
  media2: {
    height: 680
  },
  main: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 500
  }
}));

export default function Settings() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
    right: false,
    long_up: false,
    hand_gesture: true,
    voice_recognition: false,
    eye_tracking: false
  });

  const handleChange = name => event => {
    const config = {};
    if (typeof name == "object") {
      config.factory_setting = {
        ...state,
        interaction_mode: event.target.value
      };
    } else if (typeof name == "string") {
      config.factory_setting = {
        ...state,
        [name]: !state[name]
      };
    }
    db.set(config).then(res => {
      setState({ ...config.factory_setting });
    });
  };

  React.useEffect(() => {
    const init = async () => {
      const setting = await db.get(["factory_setting"]);
      const {
        left,
        right,
        long_up,
        hand_gesture,
        voice_recognition,
        eye_tracking
      } = setting.factory_setting;
      setState({
        left: left,
        right: right,
        long_up: long_up,
        hand_gesture: hand_gesture,
        voice_recognition: voice_recognition,
        eye_tracking: eye_tracking
      });
    };
    init()
      .then(res => {})
      .catch(e => {});
  }, []);

  return (
    <div>
      <h1>Basic Setting</h1>
      <div className={classes.main}>
        <List dense={false}>
          <h3>Interaction Mode Settings</h3>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Hand Gesture Recognition"
              secondary={false}
            />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.hand_gesture}
                onChange={handleChange("hand_gesture")}
                value={state.hand_gesture}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Voice Recognition" secondary={false} />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.voice_recognition}
                onChange={handleChange("voice_recognition")}
                value={state.voice_recognition}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Eye movement" secondary={false} />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.eye_tracking}
                onChange={handleChange("eye_tracking")}
                value={state.eye_tracking}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <h3>Basic Settings</h3>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="`Left swipe` to change current tab towards left."
              secondary={false}
            />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.left}
                onChange={handleChange("left")}
                value={state.left}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="`Right swipe` to change current tab towards right."
              secondary={false}
            />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.right}
                onChange={handleChange("right")}
                value={state.right}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="`Long up swipe` to close current tab."
              secondary={false}
            />
            <ListItemSecondaryAction>
              <Checkbox
                checked={state.long_up}
                onChange={handleChange("long_up")}
                value={state.long_up}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
