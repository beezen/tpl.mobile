<!--
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-08 12:52:52
-->
# 模板

## 项目构建命令

```bash
npm i # 安装依赖（确保已经安装了tnpm）
npm run start # 启动开发环境
npm run build:dev # 构建项目（开发环境）。  
npm run build:fat # 构建项目（测试环境）。  
npm run build:uat # 构建项目（综测环境）。  
npm run build:prd # 构建项目（生产环境）。  
```

## 使用说明

```bash
digo new <分类>/<组件名> [组件显示名] [组件描述] # 创建新组件
digo api # 生成接口文档
```

> 具体示范如下：

``` bash
digo new utils/test 测试工具 主要是用来测试的工具 # 创建辅助函数
digo new components/banner 轮播组件 主要是图片滚动播放 # 创建公用 react 组件
digo new entries/demo 案例 案例页面 # 创建入口组件
digo api # 生成接口文档
```
