const { ProgressPlugin } = require("webpack");

module.exports = {
  plugins: [
    new ProgressPlugin(),
  ],
  resolve: {
    fallback: {
      vm: require.resolve('vm-browserify'),
    },
  },
}
