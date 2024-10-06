const { composePlugins, withNx, withReact } = require('@nx/rspack');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.experiments.asyncWebAssembly = true;
  config.output.publicPath = '/coral-save-editor/';
  if (!config.devServer.devMiddleware) {
    config.devServer.devMiddleware = {};
  }
  config.devServer.devMiddleware.publicPath = '/coral-save-editor/';
  return config;
});
