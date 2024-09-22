const { composePlugins, withNx, withReact } = require('@nx/rspack');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.experiments.asyncWebAssembly = true;
  return config;
});
