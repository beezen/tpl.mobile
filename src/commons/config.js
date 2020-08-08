/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-08 12:48:45
 */
// 后端接口
let definedBaseURL = {
  dev: "mock",
  // dev: "http://xxx.fat1.xxx.work/api/",
  fat: "http://xxx.fat1.xxx.work/api",
  uat: "http://xxx.wdai.com",
  prd: "https://xxx.xxx.com.cn",
};
let baseURL = definedBaseURL[__wd_define_env__];

// 构建环境变量
let definedEnv = __wd_define_env__;

module.exports = {
  baseURL, // 后端接口前缀
  definedEnv, // 环境变量
}