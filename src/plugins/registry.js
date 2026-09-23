import manifest from "./plugins.json";
import { helloWorldPlugin } from "./hello-world/index.js";

// Metro resolves imports statically, so every plugin shipped inside the app
// bundle has to be registered here under the `url` used in plugins.json.
// Plugins fetched from a remote registry later won't need an entry here —
// they will bring their own code.
const bundledCode = {
  "./hello-world": helloWorldPlugin,
};

export const plugins = manifest.plugins.map((plugin) => ({
  ...plugin,
  code: bundledCode[plugin.url] ?? null,
}));

export function getPlugin(url) {
  return plugins.find((plugin) => plugin.url === url) ?? null;
}
