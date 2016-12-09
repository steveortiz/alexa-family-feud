module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "index.js",
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          }
        ]
    }
};
