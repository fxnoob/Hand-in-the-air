import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CustomSwipeHandlers from "./showCustomSwipe";
import Db from "../../../src/lib/db";
import customTlds from "../../../src/constants/customTlds";
import * as Babel from "@babel/standalone";

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

export default function FilledTextFields() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    url: "",
    codeString: "",
    saveBtnText: "Save"
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const saveCustomSwipeHandler = () => {
    let comments = ''
    const { url, codeString } = values;
    let transpiledCodeString;
    if (url !== "" && codeString !== "") {
      try {
        transpiledCodeString = Babel.transform(codeString, {
          presets: ["es2015", "es2016", "es2017"]
        }).code;
      } catch (e) {
        alert(e);
        return;
      }
      const domain = parseDomain(url, { customTlds: customTlds });
      const domainWithTld = domain.domain + "." + domain.tld;
      db.set({
        [domainWithTld]: {
          codeString: transpiledCodeString,
          created: +new Date(),
          url: url,
          isActive: 1
        }
      }).then(res => {
        alert("Saved!");
        setValues({ ...values, codeString: "", url: "", saveBtnText: "Save" });
        window.location.reload();
      });
    } else {
      alert("Empty values are not allowed");
    }
  };

  return (
    <div>
      <h3>
        Create Custom Handler or Download from{" "}
        <a
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
          cols="5"
          className={classes.textField}
          margin="normal"
          variant="filled"
        />
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
      <CustomSwipeHandlers />
    </div>
  );
}
