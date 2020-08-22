/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-22 23:15:18
 */
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const base = require('./webpack.base');

module.exports = webpackMerge(base, {
  devtool: "none",
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            dead_code: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
});