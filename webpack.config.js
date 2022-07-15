const path = require("path");

module.exports = {
  entry: "./lib/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        // NOTE: convert bundled css to file instead of js adding it inline in html?
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  target: "web",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist"),
    library: "NotesWidget",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
};
