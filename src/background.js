import "@babel/polyfill";
import Gest from "./lib/gest.es6";
import ChromeApi from "./lib/chromeApi";
import Db, { Schema } from "./lib/db";
import customTlds from "./constants/customTlds";

const parseDomain = require("parse-domain");
let AppInitState = 0; // it means app is off on startup

const gest = new Gest();
const schema = new Schema();
const db = new Db();

class Main extends ChromeApi {
  constructor() {
    super();
    this.LastRecordedTimeStamp = +new Date();
  }

  init = async () => {
    await this.initDb();
    this.setUpTabSwipe();
    this.popUpClickSetup();
  };

  initDb = async () => {
    const res = await db.get(["loadedFirstTime3"]);
    if (!res.hasOwnProperty("loadedFirstTime3")) {
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
          this.openHelpPage();
        } else {
          const currentTimeStamp = +new Date();
          const diffTimeStamp = Math.abs(
            currentTimeStamp - this.LastRecordedTimeStamp
          );
          //lock for 1.5 sec for next gesture recognition
          if (diffTimeStamp > 1500) {
            const initCustomHandler = await this.setUpCustomTabSwipe(gesture);
            if (!initCustomHandler) {
              const setting = await db.get(["factory_setting"]);
              const { left, right, long_up } = setting.factory_setting;
              if (gesture.direction === "Left" && left) {
                this.shiftToLeftTab();
              } else if (gesture.direction === "Right" && right) {
                this.shiftToRightTab();
              } else if (gesture.direction === "Long up" && long_up) {
                this.closeActiveTab();
              }
            }
            this.LastRecordedTimeStamp = currentTimeStamp;
          }
        }
      } catch (e) {
        console.log({ e });
      }
    });
  };

  setUpCustomTabSwipe = async gesture => {
    const currentTab = await this.getActiveTab();
    console.log({ currentTab });
    const key = parseDomain(currentTab.url, { customTlds: customTlds });
    if (key === null) return 0;
    else {
      try {
        const k = key.domain + "." + key.tld;
        const _data = await db.get([k]);
        if (!_data[k].isActive) return 0;
        else if (_data[k].type === 0) {
          console.log("type 0");
          await this.sendMessageToActiveTab({
            action: _data[k].action,
            gesture: gesture
          });
        } else if (_data[k].type === 1) {
          chrome.tabs.executeScript(currentTab.id, {
            code:
              "var gesture = " +
              JSON.stringify(gesture) +
              ";" +
              _data[k].codeString
          });
        }
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
