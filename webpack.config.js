const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const buildPath = "./build/";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, buildPath),
    filename: "[name].[hash].js",
    //publicPath: path.join(__dirname, buildPath)
  },
  target: "web",
  devtool: "source-map",
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      title: "WebGL Chess",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash:8].css",
    }),
  ],
};
