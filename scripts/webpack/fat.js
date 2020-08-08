/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-08 13:00:54
 */
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(base,{
  devtool:"source-map",
});