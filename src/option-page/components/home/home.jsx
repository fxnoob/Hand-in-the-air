import React from "react";
import * as Babel from "@babel/standalone";
import makeStyles from "@material-ui/core/styles/makeStyles";
import propTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CustomSwipeHandlersList from "./showCustomSwipe";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../../components/TabPanel";
import Db from "../../../lib/db";
import customTlds from "../../../constants/customTlds";
import { names as defaultPlugins } from "../../../default_plugins/registry";

const db = new Db();
const parseDomain = require("parse-domain");
const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 500
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const options = ["Clear", ...defaultPlugins];
const ITEM_HEIGHT = 48;

function CustomGesturesForm(props) {
  const classes = useStyles();
  const [isDefaultPluginSelected, seelctDefaultPlugin] = React.useState(false);
  const [values, setValues] = React.useState({
    url: "",
    codeString: "",
    saveBtnText: "Save"
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const selectOption = option => {
    setAnchorEl(event.currentTarget);
    if (option === "") {
      seelctDefaultPlugin(false);
    } else {
      seelctDefaultPlugin(true);
    }
    let evt = {
      target: {
        value: option
      }
    };
    handleChange("codeString")(evt);
    setAnchorEl(null);
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const saveCustomSwipeHandler = () => {
    const { url, codeString } = values;
    if (url !== "" && codeString !== "") {
      const obj = {
        created: +new Date(),
        url: url,
        isActive: 1,
        type: null,
        codeString: "",
        action: "",
        mode: props.mode // hand_gesture, voice_recognition etc
      };
      const type = isDefaultPluginSelected === true ? 0 : 1;
      if (type === 0) {
        obj.type = 0;
        obj.action = codeString;
        obj.codeString = codeString;
      } else {
        obj.type = 1;
        let transpiledCodeString;
        try {
          transpiledCodeString = Babel.transform(codeString, {
            presets: ["es2015", "es2016", "es2017"]
          }).code;
          obj.codeString = transpiledCodeString;
        } catch (e) {
          alert(e);
          return;
        }
      }
      const domain = parseDomain(url, { customTlds: customTlds });
      const domainWithTld = domain.domain + "." + domain.tld;
      db.set({
        [domainWithTld]: obj
      }).then(() => {
        alert("Saved!");
        setValues({ ...values, codeString: "", url: "", saveBtnText: "Save" });
        window.location.reload();
      });
    }
  };

  return (
    <div>
      <h3 style={{ paddingLeft: '1rem' }}>
        Create Custom Handler or Download from{" "}
        <a
          rel="noreferrer"
          href="https://github.com/fxnoob/hand-gestures-chrome-extension"
          target="_blank"
        >
          {" "}
          here{" "}
        </a>
      </h3>
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="url"
          label="Url"
          value={values.url}
          onChange={handleChange("url")}
          className={classes.textField}
          margin="normal"
          variant="filled"
          inputProps={{ "aria-label": "url" }}
        />
        <TextField
          id="filled-multiline-static"
          label="Code"
          value={values.codeString}
          onChange={handleChange("codeString")}
          rows="4"
          disabled={isDefaultPluginSelected}
          cols="5"
          className={classes.textField}
          margin="normal"
          variant="filled"
        />
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200
            }
          }}
        >
          {options.map(option =>
            <MenuItem
              style={{ borderBottom: "1px solid black" }}
              key={option}
              value={option}
              selected={option === "None"}
              onClick={() => {
                selectOption(option === "Clear" ? "" : option);
              }}
            >
              {option}
            </MenuItem>
          )}
        </Menu>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={saveCustomSwipeHandler}
        >
          {values.saveBtnText}
        </Button>
      </form>
      <Divider />
      <CustomSwipeHandlersList {...props}/>
    </div>
  );
}
CustomGesturesForm.propTypes = {
  mode: propTypes.string
};

const HomeView = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper square>
      <Tabs
        style={{ padding: '1rem' }}
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="Custom handlers tabs"
      >
        <Tab label="Voice Recognition" />
        <Tab label="Hand Gesture" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CustomGesturesForm mode="voice_recognition" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CustomGesturesForm mode="hand_gesture" />
      </TabPanel>
    </Paper>
  );
};

export default HomeView;
