import "@babel/polyfill";
import * as SpeechSynthesis from "annyang";
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
    this.setUpHandGesture();
    this.setUpVoiceRecognition();
    this.popUpClickSetup();
  };
  initDb = async () => {
    let queryRes;
    const res = await db.get(["loadedFirstTime3"]);
    if (!res.hasOwnProperty("loadedFirstTime3")) {
      queryRes = {
        loadedFirstTime: true,
        ...schema.data,
        ...schema.Plugins
      };
      await db.set(queryRes);
    } else {
      queryRes = await db.getAll();
    }
    return queryRes;
  };
  setUpVoiceRecognition = () => {
    const commands = {
      left: () => {
        this.shiftToLeftTab();
      },
      right: () => {
        this.shiftToRightTab();
      },
      close: () => {
        this.stopApp();
      }
    };
    SpeechSynthesis.addCommands(commands);
  };

  setUpVoiceRecognitionCallback = async command => {
    const currentTab = await this.getActiveTab();
    const key = parseDomain(currentTab.url, { customTlds: customTlds });
    if (key === null) return 0;
    else {
      try {
        const k = key.domain + "." + key.tld;
        const _data = await db.get([k]);
        if (!_data[k].isActive ||
          _data[k].mode != 'voice_recognition') return 0;
        else if (_data[k].type === 0) {
          await this.sendMessageToActiveTab({
            action: _data[k].action,
            gesture: ''
          });
        } else if (_data[k].type === 1) {
          chrome.tabs.executeScript(currentTab.id, {
            code:
              "var command = " +
              JSON.stringify(command) +
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

  setUpHandGesture = () => {
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
            const initCustomHandler = await this.setUpGestureCallback(gesture);
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
        /* eslint-disable no-console */
        console.log(e);
      }
    });
  };

  setUpGestureCallback = async gesture => {
    const currentTab = await this.getActiveTab();
    const key = parseDomain(currentTab.url, { customTlds: customTlds });
    if (key === null) return 0;
    else {
      try {
        const k = key.domain + "." + key.tld;
        const _data = await db.get([k]);
        if (!_data[k].isActive ||
          _data[k].mode != 'hand_gesture') return 0;
        else if (_data[k].type === 0) {
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
    chrome.browserAction.onClicked.addListener(() => {
      if (this.toggleApp()) {
        this.startApp();
      } else {
        this.stopApp();
      }
    });
  }

  toggleApp = () => {
    AppInitState = AppInitState ? 0 : 1;
    return AppInitState;
  };

  startApp = async () => {
    const data = await db.get(["factory_setting"]);
    const {
      hand_gesture,
      voice_recognition,
      eye_tracking
    } = data.factory_setting;

    if (hand_gesture) {
      gest.start();
    }
    if (voice_recognition) {
      SpeechSynthesis.start();
    }
    if (eye_tracking) {
      // enable webgazer.js
    }
  };

  stopApp = async () => {
    AppInitState = 0;
    gest.stop();
    SpeechSynthesis.pause();
  };
}

const main = new Main();
main
  .init()
  .then(() => {})
  .catch(() => {});
