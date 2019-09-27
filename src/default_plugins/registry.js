import Oridomi from "./oridomi";

const Plugins = {};

const registerPlugin = (...plugins) => {
  plugins.map(plugin => {
    Object.assign(Plugins, { [plugin.name]: plugin.exec });
  });
};
//register plugin here
registerPlugin(Oridomi);

export const names = Object.keys(Plugins);

export default Plugins;
