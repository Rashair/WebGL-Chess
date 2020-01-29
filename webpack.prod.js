const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const JavaScriptObfuscator = require("webpack-obfuscator");

module.exports = merge(common, {
  mode: "production",
  devtool: "none",
  plugins: [
    new JavaScriptObfuscator({
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      debugProtectionInterval: false,
      disableConsoleOutput: true,
      identifierNamesGenerator: "hexadecimal",
      log: false,
      renameGlobals: false,
      rotateStringArray: true,
      selfDefending: true,
      shuffleStringArray: true,
      splitStrings: false,
      stringArray: true,
      stringArrayEncoding: false,
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    })
  ]
});
