import "@babel/polyfill"
import Gest from './lib/gest.es6'
import ChromeApi from './lib/chromeApi'

let AppInitState = 0 // it means app is off on startup

const gest = new Gest();
const chromeObj = new ChromeApi()

class Main extends ChromeApi{
    constructor() {
        super()
    }

    init = () => {
        this.setUpTabSwipe()
        this.popUpClickSetup()
    }

    setUpTabSwipe = () => {
        gest.options.subscribeWithCallback((gesture) => {
            if(gesture.direction === "Left") {
                console.log("Left")
                chromeObj.shiftToLeftTab()
            } else if (gesture.direction === "Right") {
                console.log("Right")
                chromeObj.shiftToRightTab()
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
main.init()

