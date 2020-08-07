class ChromeApi {
  constructor() {}

  getActiveTab = () => {
    return new Promise((resolve) => {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        resolve(tabs[0]);
      });
    });
  };

  sendMessageToActiveTab = async payload => {
    const tab = await this.getActiveTab();
    chrome.tabs.sendMessage(tab.id, payload);
    return true;
  };

  traverseTabs = callback => {
    chrome.tabs.query({}, tabs => {
      callback(tabs);
    });
  };

  shiftToLeftTab = () => {
    this.traverseTabs(tabs => {
      let activeTabIndex = -1;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
          activeTabIndex = i;
          break;
        }
      }
      if (activeTabIndex === 0) {
        chrome.tabs.update(tabs[tabs.length - 2].id, { highlighted: true });
      } else {
        chrome.tabs.update(tabs[activeTabIndex - 1].id, { highlighted: true });
      }
      chrome.tabs.update(tabs[activeTabIndex].id, { highlighted: false });
    });
  };

  shiftToRightTab = () => {
    this.traverseTabs(tabs => {
      let activeTabIndex = -1;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
          activeTabIndex = i;
          break;
        }
      }
      if (activeTabIndex === tabs.length - 1) {
        chrome.tabs.update(tabs[0].id, { highlighted: true });
      } else {
        chrome.tabs.update(tabs[activeTabIndex + 1].id, { highlighted: true });
      }
      chrome.tabs.update(tabs[activeTabIndex].id, { highlighted: false });
    });
  };

  closeActiveTab = callback => {
    chrome.tabs.query({ active: true }, tabs => {
      const tabId = tabs[0].id;
      chrome.tabs.remove(tabId, callback);
    });
  };

  openHelpPage = () => {
    let helpTabIsOpened = false;
    let activeTabId = -1;
    const helpUrl = chrome.extension.getURL("option.html") + "?page=help";
    chrome.tabs.query({}, tabs => {
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url === helpUrl) {
          chrome.tabs.update(tabs[i].id, { highlighted: true });
          helpTabIsOpened = true;
        }
        if (tabs[i].active) {
          activeTabId = tabs[i].id;
        }
      }
      if (!helpTabIsOpened) {
        chrome.tabs.create({ url: helpUrl }, () => {});
      }
      chrome.tabs.update(activeTabId, { highlighted: false });
    });
  };
}

export default ChromeApi;
