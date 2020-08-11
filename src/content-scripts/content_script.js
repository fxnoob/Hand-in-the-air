import Plugins from "../default_plugins/registry";
export default class ContentScript {
  init = () => {
    this.initRoutes();
  };
  initRoutes = () => {
    chrome.runtime.onMessage.addListener((message) => {
      const { action, mode, command, gesture } = message;
      try {
        const event = new CustomEvent('hita:detect', { detail: message });
        document.dispatchEvent(event);
        if (mode == 'voice_recognition') {
          Plugins[action].execVR(command);
        } else if (mode == 'hand_gesture') {
          Plugins[action].execHG(gesture);
        }
      } catch (e) {
        /* eslint-disable no-console */
        console.log(e);
      }
      return true;
    });
  };
}
