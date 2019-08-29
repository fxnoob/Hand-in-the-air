class ChromeApi {

    constructor() {}

    traverseTabs = (callback) => {
        chrome.tabs.query({}, (tabs) => {
            callback(tabs)
        });
    }

    shiftToLeftTab = () => {
        this.traverseTabs(tabs => {
            let data = []
            let activeTabIndex = -1;
            for (let i = 0; i < tabs.length; i++) {
                if(tabs[i].active) {
                    activeTabIndex = i
                    break;
                }
            }
            if(activeTabIndex === 0) {
                chrome.tabs.update(tabs[tabs.length-2].id, {highlighted: true});
            } else {
                chrome.tabs.update(tabs[activeTabIndex-1].id, {highlighted: true});
            }
            chrome.tabs.update(tabs[activeTabIndex].id, {highlighted: false});
        })
    }

    shiftToRightTab = () => {
        console.log("In right")
        this.traverseTabs(tabs => {
            let activeTabIndex = -1;
            for (let i = 0; i < tabs.length; i++) {
                if(tabs[i].active) {
                    activeTabIndex = i
                    break;
                }
            }
            if(activeTabIndex === tabs.length-1) {
                chrome.tabs.update(tabs[0].id, {highlighted: true});
            } else {
                chrome.tabs.update(tabs[activeTabIndex+1].id, {highlighted: true});
            }
            chrome.tabs.update(tabs[activeTabIndex].id, {highlighted: false});
        })
    }

    closeActiveTab = (callback) => {
        chrome.tabs.query({"active": true}, (tabs) => {
            console.log({tabs})
            var url = tabs[0].url;
            const tabId = tabs[0].id;
            console.log("URL from main.js", url);
            chrome.tabs.remove(tabId, callback)
        });
    }

}

export default ChromeApi;
