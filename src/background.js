import "@babel/polyfill";
import Gest from "./lib/gest.es6";
import ChromeApi from "./lib/chromeApi";
import Db, { Schema } from "./lib/db";
import customTlds from "./constants/customTlds";

const parseDomain = require("parse-domain");
let AppInitState = 0; // it means app is off on startup

const gest = new Gest();
const chromeObj = new ChromeApi();
const schema = new Schema();
const db = new Db();

class Main extends ChromeApi {
  constructor() {
    super();
  }

  init = async () => {
    await this.initDb();
    this.setUpTabSwipe();
    this.popUpClickSetup();
  };

  initDb = async () => {
    const res = await db.get(["loadedFirstTime2"]);
    if (!res.hasOwnProperty("loadedFirstTime2")) {
      await db.set({
        loadedFirstTime: true,
        ...schema.data,
        ...schema.Plugins
      });
    }
  };

  setUpTabSwipe = () => {
    gest.options.subscribeWithCallback(async gesture => {
      try {
        if (gesture.error) {
          AppInitState = 0;
          chromeObj.openHelpPage();
        } else {
          const initCustomHandler = await this.setUpCustomTabSwipe(gesture);
          if (!initCustomHandler) {
            const setting = await db.get(["factory_setting"]);
            const { left, right, long_up } = setting.factory_setting;
            if (gesture.direction === "Left" && left) {
              chromeObj.shiftToLeftTab();
            } else if (gesture.direction === "Right" && right) {
              chromeObj.shiftToRightTab();
            } else if (gesture.direction === "Long up" && long_up) {
              chromeObj.closeActiveTab();
            }
          }
        }
      } catch (e) {
        console.log({ e });
      }
    });
  };

  setUpCustomTabSwipe = async gesture => {
    const currentTab = await chromeObj.getActiveTab();
    console.log({ currentTab });
    const key = parseDomain(currentTab.url, { customTlds: customTlds });
    if (key === null) return 0;
    else {
      try {
        const k = key.domain + "." + key.tld;
        const _data = await db.get([k]);
        if (!_data[k].isActive) return 0;
        chrome.tabs.executeScript(currentTab.id, {
          code:
            "var gesture = " +
            JSON.stringify(gesture) +
            ";" +
            _data[k].codeString
        });
        return 1;
      } catch (e) {
        return 0;
      }
    }
  };

  popUpClickSetup() {
    chrome.browserAction.onClicked.addListener(tab => {
      if (this.toggleApp()) {
        gest.start();
      } else {
        this.stopApp();
      }
    });
  }

  toggleApp = () => {
    AppInitState = AppInitState ? 0 : 1;
    return AppInitState;
  };

  stopApp = () => {
    AppInitState = 0;
    gest.stop();
  };
}

const main = new Main();
main
  .init()
  .then(res => {
    console.log({ res });
  })
  .catch(e => {
    console.log({ e });
  });
