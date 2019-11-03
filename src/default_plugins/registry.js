import Oridomi from "./oridomi";
import Throwable from "./throwable";
import Tab from "./tab";
import MuteUnmute from "./mute_unmute";

const Plugins = {};

const registerPlugin = (...plugins) => {
  plugins.map(plugin => {
    Object.assign(Plugins, { [plugin.name]: plugin.exec });
  });
};
//register plugin here
registerPlugin(Oridomi, Throwable, Tab, MuteUnmute);

export const names = Object.keys(Plugins);

export default Plugins;
