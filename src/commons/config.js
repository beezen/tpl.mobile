/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-22 23:13:57
 */
// 后端接口
let definedBaseURL = {
  dev: "mock",
  // dev: "http://xxx.xxx.com",
  fat: "http://xxx.xxx.com",
  uat: "http://xxx.xxx.com",
  prd: "https://xxx.xxx.com",
};
let baseURL = definedBaseURL[__wd_define_env__];

// 构建环境变量
let definedEnv = __wd_define_env__;

module.exports = {
  baseURL, // 后端接口前缀
  definedEnv, // 环境变量
}