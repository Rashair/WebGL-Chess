const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const buildPath = "./build/";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, buildPath),
    filename: "[name].[hash].js",
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: path.resolve(__dirname, "./node_modules/"),
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|babylon|mtl||gltf|pcb|pcd|prwm|obj|mat|mp3|ogg|bin)$/i,
        use: "file-loader",
        exclude: path.resolve(__dirname, "./node_modules/"),
      },
      {
        test: /\.(vert|frag|glsl|shader|txt)$/i,
        use: "raw-loader",
        exclude: path.resolve(__dirname, "./node_modules/"),
      },
      {
        type: "javascript/auto",
        test: /\.(json)/,
        exclude: path.resolve(__dirname, "./node_modules/"),
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      title: "WebGL Chess",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
};
