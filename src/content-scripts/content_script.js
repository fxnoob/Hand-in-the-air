import Plugins from "../default_plugins/registry";
export default class ContentScript {
  init = () => {
    this.initRoutes();
  };
  initRoutes = () => {
    chrome.runtime.onMessage.addListener((message) => {
      const { action, gesture } = message;
      try {
        Plugins[action](gesture);
      } catch (e) {
        /* eslint-disable no-console */
        console.log(e);
      }
      return true;
    });
  };
}
