// --- START OF webpack.config.js ---
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // 1. Mode: 'production' enables various optimizations including minification
  mode: 'production',

  // 2. Entry Points: Define the main JS files for each HTML page
  entry: {
    // Each entry point will create a separate bundle
    login: './public/script.js',
    dashboard: './public/dashboard.js'
    // We can add other pages like 'survey' here if they have significant JS
  },

  // 3. Output: Where the bundled files will be placed
  output: {
    // '[name]' is a placeholder that will be replaced by the entry point key (e.g., 'login', 'dashboard')
    // '[contenthash]' adds a unique hash to the filename, which is crucial for cache busting
    filename: 'bundles/[name].[contenthash].js',
    // The output directory for all bundled assets
    path: path.resolve(__dirname, 'dist'),
    // Clean the output directory before each build
    clean: true,
  },

  // 4. Loaders: Rules for how different types of files should be processed
  module: {
    rules: [
      {
        // For CSS files, use MiniCssExtractPlugin to extract them into separate files
        // and css-loader to handle @import and url()
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        // For JavaScript files, you could add Babel here if you needed to transpile modern JS
        test: /\.js$/,
        exclude: /node_modules/,
        // No specific loader needed for basic JS, but babel-loader would go here
      },
    ],
  },

  // 5. Plugins: Extend Webpack's functionality
  plugins: [
    // Extracts CSS into separate files. One file per JS entry point that contains CSS.
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),

    // Automatically generates an HTML file for each entry point, injecting the correct
    // script and style tags.
    new HtmlWebpackPlugin({
      // Which HTML template to use
      template: './public/index.html',
      // The output filename
      filename: 'index.html',
      // Which chunks (entry points) to include in this HTML file
      chunks: ['login'],
      // Inject the assets into the head of the document
      inject: 'head',
    }),
    new HtmlWebpackPlugin({
      template: './public/dashboard.html',
      filename: 'dashboard.html',
      chunks: ['dashboard'],
      inject: 'head',
    }),
    // You would add another HtmlWebpackPlugin for `patron_survey.html` if needed
  ],

  // 6. Optimization: Configure minification and other performance optimizations
  optimization: {
    // Enable minimization
    minimize: true,
    // Define the minimizers to use
    minimizer: [
      // For JavaScript
      new TerserPlugin(),
      // For CSS
      new CssMinimizerPlugin(),
    ],
    // Optional: Split vendor code (like Firebase) into a separate chunk
    splitChunks: {
      chunks: 'all',
    },
  },

  // 7. Devtool: Source maps for easier debugging in production (optional but recommended)
  devtool: 'source-map',
};
// --- END OF webpack.config.js ---
