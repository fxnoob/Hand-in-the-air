import React, { Suspense, lazy } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Home from "./home/home";
import Help from "./help/help";
import About from "./about/about";
import Setting from "./setting/setting";

const queryString = require("query-string");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function ScrollableTabsButtonAuto() {
  let initState = 0;
  const classes = useStyles();
  const parsed = queryString.parse(location.search);
  if (parsed.page) {
    switch (parsed.page) {
      case "home":
        initState = 0;
        break;
      case "help":
        initState = 1;
        break;
      case "setting":
        initState = 2;
        break;
      case "about":
        initState = 3;
        break;
    }
  }
  const [value, setValue] = React.useState(initState);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="lg" spacing={10}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="tabs"
          >
            <Tab label="Home" {...a11yProps(0)} />
            <Tab label="Help" {...a11yProps(1)} />
            <Tab label="Setting" {...a11yProps(3)} />
            <Tab label="About" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Suspense fallback={<div>Loading...</div>}>
            <Help />
          </Suspense>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Suspense fallback={<div>Loading...</div>}>
            <Setting />
          </Suspense>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Suspense fallback={<div>Loading...</div>}>
            <About />
          </Suspense>
        </TabPanel>
      </Container>
    </div>
  );
}
