import Plugins from "../src/default_plugins/registry";
export default class ContentScript {
  init = () => {
    this.initRoutes();
  };
  initRoutes = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { action, gesture } = message;
      try {
        console.log(Plugins);
        Plugins[action](gesture);
      } catch (e) {
        console.log({ e });
      }
      return true;
    });
  };
}
