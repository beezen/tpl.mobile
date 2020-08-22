/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-22 23:14:49
 */
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = webpackMerge(base,{
  devtool:"source-map",
});