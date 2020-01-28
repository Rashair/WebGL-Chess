const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const JavaScriptObfuscator = require("webpack-obfuscator");

module.exports = merge(common, {
  mode: "production",
  devtool: "none",
  plugins: [
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    }),
  ],
});
