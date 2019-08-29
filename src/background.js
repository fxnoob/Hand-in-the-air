import "@babel/polyfill"
import Gest from './lib/gest.es6'
import ChromeApi from './lib/chromeApi'
import Db, { Schema } from "./lib/db"

let AppInitState = 0 // it means app is off on startup

const gest = new Gest();
const chromeObj = new ChromeApi()
const schema = new Schema()
const db = new Db()

class Main extends ChromeApi{
    constructor() {
        super()
    }

    init = async () => {
        await this.initDb()
        this.setUpTabSwipe()
        this.popUpClickSetup()
    }

    initDb = async () => {
        const res = await db.get(["loadedFirstTine"]);
        if(!res.hasOwnProperty("loadedFirstTime")) {
            await db.set({loadedFirstTime: true, ...schema.data})
        }
    }

    setUpTabSwipe = () => {
        gest.options.subscribeWithCallback((gesture) => {
            console.log({gesture})
            if(gesture.direction === "Left") {
                console.log("Left")
                chromeObj.shiftToLeftTab()
            } else if (gesture.direction === "Right") {
                console.log("Right")
                chromeObj.shiftToRightTab()
            } else if (gesture.direction === "Long up") {
                console.log("Long up")
                chromeObj.closeActiveTab()
            }
        })
    }

    popUpClickSetup() {
        chrome
            .browserAction
            .onClicked
            .addListener((tab) => {
                if(this.toggleApp()) {
                    gest.start();
                } else {
                    this.stopApp()
                }
            });
    }

    toggleApp = () => {
      AppInitState = AppInitState?0:1;
      return AppInitState
    }

    stopApp = () => {
       AppInitState = 0
        gest.stop();
    }
}


const main = new Main()
main
    .init()
    .then(res => {console.log({res})})
    .catch(e=> {console.log({e})});
